#!/usr/bin/env node
import parser from "@solidity-parser/parser";
import fs from "node:fs";
import path from "path";
import { Command } from "commander";
import chalk from "chalk";
import boxen from "boxen";

const program = new Command();

program
    .argument("<path>", "path of your smart contract")
    .option("--ast", "enable AST output")
    .parse(process.argv);

const solidityFilePath = program.args[0];
const enableAST = program.opts().ast || false;

try {
    fs.statSync(solidityFilePath).isFile();
} catch (error) {
    if (error.errno === -4058) {
        throw Error("Contract not found. The given path is wrong!");
    }
}

const readSolidityFile = (filePath) => {
    try {
        return fs.readFileSync(filePath, "utf8");
    } catch (err) {
        console.error(`Error reading file: ${filePath}`, err);
        process.exit(1);
    }
};

const writeJsonToFile = (fileName, data) => {
    const jsonString = JSON.stringify(data, null, 4);
    const filePath = path.join(import.meta.dirname, fileName);

    fs.writeFile(filePath, jsonString, (err) => {
        if (err) {
            console.error("Error writing to file", err);
        }
    });
};

const logMessage = (message, link, location, type) => {
    let color, icon, title;

    switch (type) {
        case "critical":
            color = chalk.red;
            icon = "🚨";
            title = "Critical";
            break;
        case "high":
            color = chalk.magenta;
            icon = "🔥";
            title = "High";
            break;
        case "warning":
            color = chalk.yellow;
            icon = "⚠️";
            title = "Warning";
            break;
        case "info":
            color = chalk.blue;
            icon = "ℹ️";
            title = "Info";
            break;
    }

    const formattedMessage = boxen(
        `${icon} ${color.bold(title)}\n\n` +
            `${color(message)}\n` +
            `${chalk.dim(
                `Location: Line ${location.start.line}, Column ${location.start.column}`
            )}\n` +
            `${chalk.cyan.underline(link)}`,
        {
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "#FF9800",
        }
    );

    console.log(formattedMessage);
};

const objectHasProperty = (object, propertyName, propertyKey) => {
    if (typeof object !== "object" || object === null) return false;

    return Object.entries(object).some(([key, value]) => {
        return (
            (key === propertyKey && value === propertyName) ||
            (typeof value === "object" &&
                objectHasProperty(value, propertyName, propertyKey))
        );
    });
};

const CaseType = {
    MIXED_CASE: "mixedCase",
    CAP_WORD: "capWord",
    UPPER_CASE: "upperCase",
};

function checkStringCase(inputStr, caseType) {
    switch (caseType) {
        case CaseType.MIXED_CASE:
            return /[a-z]+([A-Z][a-z]+)*/.test(inputStr);
        case CaseType.CAP_WORD:
            return /([A-Z][a-z]+)+/.test(inputStr);
        case CaseType.UPPER_CASE:
            return /^[A-Z_]+$/.test(inputStr);
        default:
            throw new Error("Invalid case type");
    }
}

const countStringInValues = (nestedArray, searchString) => {
    let count = 0;

    const countValues = (obj) => {
        if (typeof obj === "object" && obj !== null) {
            for (const key in obj) {
                if (typeof obj[key] === "string" && obj[key] === searchString) {
                    count++;
                } else if (typeof obj[key] === "object") {
                    countValues(obj[key]);
                }
            }
        }
    };

    nestedArray.forEach((item) => {
        countValues(item);
    });

    return count;
};

const stringValidate = (str) => new TextEncoder().encode(str).length < 32;

console.log(
    boxen(
        `${chalk.blue.bold("🔍 Analysis Started")} \n` +
            `Preparing to analyze your smart contract...`,
        {
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "blue",
            backgroundColor: "#f0f8ff", // Light blue background
        }
    )
);

const checkReentrancy = (functionDefinition, stateVariableNames) => {
    let externalCallIndex = -1;

    functionDefinition.body?.statements.some((statement, index) => {
        if (objectHasProperty(statement, "memberName", "call")) {
            externalCallIndex = index;
            return true;
        }
        return false;
    });

    if (externalCallIndex !== -1) {
        functionDefinition.body.statements
            .slice(externalCallIndex + 1)
            .forEach((statement) => {
                if (
                    statement.type === "ExpressionStatement" &&
                    stateVariableNames.includes(
                        statement.expression?.left?.name
                    )
                ) {
                    logMessage(
                        "To avoid reentrancy, do not assign to the state variable after the external call !",
                        "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/security%20rules/check_reentrancy.md",
                        statement.loc,
                        "critical"
                    );
                }
            });
    }
};

const useCalldataInsteadMemory = (functionDefinition) => {
    const validateMemoryUsage = (variable) => {
        if (variable?.storageLocation === "memory") {
            const isVariableModified = functionDefinition.body.statements.some(
                (statement) =>
                    statement.type === "ExpressionStatement" &&
                    statement.expression?.left?.name === variable.name
            );
            if (!isVariableModified) {
                logMessage(
                    "Use calldata instead of memory!",
                    "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/use_calldata_instead_of_memory.md",
                    variable.loc,
                    "warning"
                );
            }
        }
    };

    functionDefinition.parameters.forEach(validateMemoryUsage);

    // TODO reasearch
    // Check variable declarations
    // functionDefinition.body.statements.forEach((statement) => {
    //     if (statement.type === "VariableDeclarationStatement") {
    //         statement.variables.forEach(validateMemoryUsage);
    //     }
    // });
};

const specifyStateVariableVisibility = (
    stateVariableDeclaration,
    stateVariableNames
) => {
    stateVariableDeclaration.variables.forEach((variable) => {
        stateVariableNames.push(variable.name);
        if (variable.visibility === "default") {
            logMessage(
                "Specify state variable visibility!",
                "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/specify_state_variable_visibility.md",
                variable.loc,
                "info"
            );
        }
    });
};

const specifyFunctionVisibility = (functionDefinition) => {
    if (
        functionDefinition.visibility === "default" &&
        !functionDefinition.isConstructor
    ) {
        logMessage(
            "Specify function visibility!",
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/specify_function_visibility.md",
            functionDefinition.loc,
            "info"
        );
    }
};

const cacheVariable = (stateVariableNames, functionDefinition) => {
    stateVariableNames.forEach((stateVariableName) => {
        const numberOfUsed = countStringInValues(
            functionDefinition.body.statements,
            stateVariableName
        );
        if (numberOfUsed > 2) {
            logMessage(
                `To optimize gas consumption, it is suggested to cache your variable "${stateVariableName}" in function "${functionDefinition.name}" .`,
                "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/cache_variable.md",
                functionDefinition.loc,
                "warning"
            );
        }
    });
};

const avoidUseTxOrigin = (memberAccess) => {
    if (
        memberAccess.expression.name === "tx" &&
        memberAccess.memberName === "origin"
    ) {
        logMessage(
            "Avoid using tx.origin!",
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/security%20rules/avoid_using_tx.origin.md",
            memberAccess.loc,
            "critical"
        );
    }
};

const avoidUseBlockTimestamp = (memberAccess) => {
    if (
        memberAccess.expression.name === "block" &&
        memberAccess.memberName === "timestamp"
    ) {
        logMessage(
            "Avoid using block.timestamp!",
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/security%20rules/avoid_using_block_timestamp.md",
            memberAccess.loc,
            "warning"
        );
    }
};

const checkReturnedValue = (variableDeclarationStatement) => {
    if (
        variableDeclarationStatement.initialValue?.expression?.expression
            ?.memberName === "call" &&
        !variableDeclarationStatement.variables[0]
    ) {
        logMessage(
            "Capture the return value of external calls!",
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/security%20rules/check_returned_value.md",
            variableDeclarationStatement.loc,
            "high"
        );
    }
};

const useCustomError = (expressionStatement) => {
    const isRequire =
        expressionStatement.expression?.expression?.name === "require";
    if (isRequire) {
        logMessage(
            "recomended use custom error instead of require!",
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/use_custom_error_instead_of_%60require%60.md",
            expressionStatement.expression.loc,
            "warning"
        );
        if (
            !stringValidate(expressionStatement.expression.arguments[1].value)
        ) {
            logMessage(
                "recomended use string shorter than 32bytes!",
                expressionStatement.expression.arguments[1].loc,
                "warning"
            );
        }
    }
    const isRevert =
        expressionStatement.expression?.expression?.name === "revert";
    if (isRevert) {
        logMessage(
            "recomended use custom error instead of string!",
            expressionStatement.expression.loc,
            "warning"
        );
        if (
            !stringValidate(
                expressionStatement?.expression?.arguments[1]?.value
            )
        ) {
            logMessage(
                "recomended use string shorter than 32bytes!",
                expressionStatement.expression.arguments[1].loc,
                "warning"
            );
        }
    }
};
const checkReturnValue = (expressionStatement) => {
    const externalCallExpression =
        expressionStatement.expression?.expression?.expression?.memberName ===
        "call";
    const isSendOperation =
        expressionStatement.expression?.expression?.memberName === "send";
    if (externalCallExpression || isSendOperation) {
        logMessage(
            "Capture the return value of external calls!",
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/security%20rules/check_returned_value.md",
            expressionStatement.expression.loc,
            "high"
        );
    }
};

const incAndDecOneOperation = (expressionStatement) => {
    if (
        expressionStatement.expression.operator === "++" &&
        !expressionStatement.expression?.isPrefix
    ) {
        logMessage(
            `recommended to use ++ before ${expressionStatement.expression.subExpression.name}. ++${expressionStatement.expression.subExpression.name}`,
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/increment_and_decrement_by_1_in_one_operation.md",
            expressionStatement.expression.loc,
            "warning"
        );
    }
    if (
        expressionStatement.expression.operator === "--" &&
        !expressionStatement.expression?.isPrefix
    ) {
        logMessage(
            `recommended to use -- before ${expressionStatement.expression.subExpression.name}. --${expressionStatement.expression.subExpression.name}`,
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/increment_and_decrement_by_1_in_one_operation.md",
            expressionStatement.expression.loc,
            "warning"
        );
    }
    if (
        expressionStatement.expression.operator === "+=" &&
        expressionStatement.expression?.right?.number === "1"
    ) {
        logMessage(
            `recommended to use "++${expressionStatement.expression.left.name}" instead "${expressionStatement.expression.left.name} += ${expressionStatement.expression.left.name}".`,
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/increment_and_decrement_by_1_in_one_operation.md",
            expressionStatement.expression.loc,
            "warning"
        );
    }
    if (
        expressionStatement.expression.operator === "-=" &&
        expressionStatement.expression?.right?.number === "1"
    ) {
        logMessage(
            `recommended to use "--${expressionStatement.expression.left.name}" instead "${expressionStatement.expression.left.name} -= ${expressionStatement.expression.left.name}".`,
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/increment_and_decrement_by_1_in_one_operation.md",
            expressionStatement.expression.loc,
            "warning"
        );
    }
    if (
        expressionStatement.expression.operator === "=" &&
        expressionStatement.expression?.left?.name ===
            expressionStatement.expression.right?.left?.name &&
        expressionStatement.expression.right?.right?.number === "1"
    ) {
        logMessage(
            `recommended to use "++${expressionStatement.expression.left.name}" instead "${expressionStatement.expression.left.name} = ${expressionStatement.expression.left.name} + 1".`,
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/increment_and_decrement_by_1_in_one_operation.md",
            expressionStatement.expression.loc,
            "warning"
        );
    }
    if (
        expressionStatement.expression.operator === "=" &&
        expressionStatement.expression?.left?.name ===
            expressionStatement.expression.right?.right?.name &&
        expressionStatement.expression.right?.left?.number === "1"
    ) {
        logMessage(
            `recommended to use "++${expressionStatement.expression.left.name}" instead "${expressionStatement.expression.left.name} = 1 + ${expressionStatement.expression.left.name}".`,
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/increment_and_decrement_by_1_in_one_operation.md",
            expressionStatement.expression.loc,
            "warning"
        );
    }
};

const dontUseAbbreviations = (variableDeclaration) => {
    if (variableDeclaration.typeName.name === "uint") {
        logMessage(
            "Do not use type abbreviations . Specify the exact type.",
            variableDeclaration.loc,
            "info"
        );
    }
};

const checkBinaryOperation = (binaryOperation) => {
    switch (binaryOperation.operator) {
        case ">=":
            logMessage(
                "recommended to use > instead of >= for save gas.",
                "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/check_binary_operation.md",
                binaryOperation.loc,
                "warning"
            );
            break;
        case "<=":
            logMessage(
                "recommended to use < instead of <= for save gas.",
                "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/check_binary_operation.md",
                binaryOperation.loc,
                "warning"
            );
        case "&&":
            logMessage(
                "note : put the phrase that consumes less gas first.",
                "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/check_binary_operation.md",
                binaryOperation.loc,
                "warning"
            );
        case "||":
            logMessage(
                "note : put the phrase that consumes less gas first.",
                "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/check_binary_operation.md",
                binaryOperation.loc,
                "warning"
            );
            break;
    }
};

const indexedEvents = (eventDefinition) => {
    eventDefinition.parameters.forEach((parameter) => {
        if (
            parameter.typeName.type !== "UserDefinedTypeName" &&
            parameter?.typeName?.name.includes("uint") &&
            !parameter.isIndexed
        ) {
            logMessage(
                `recommended to make event "${eventDefinition.name}" parameter "${parameter.name}" indexed to reduse gas.`,
                "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/indexed_events.md",
                parameter.loc,
                "warning"
            );
        } else if (parameter.typeName.name === "bool" && !parameter.isIndexed) {
            logMessage(
                `recommended to make event "${eventDefinition.name}" parameter "${parameter.name}" indexed to reduse gas.`,
                "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/indexed_events.md",
                parameter.loc,
                "warning"
            );
        } else if (
            parameter.typeName.name === "address" &&
            !parameter.isIndexed
        ) {
            logMessage(
                `recommended to make event "${eventDefinition.name}" parameter "${parameter.name}" indexed to reduse gas.`,
                "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/indexed_events.md",
                parameter.loc,
                "warning"
            );
        }
    });
};

const cacheLengthInForStatement = (forStatement) => {
    if (
        forStatement.conditionExpression.right?.type === "MemberAccess" &&
        stateVariableNames.includes(
            forStatement.conditionExpression.right.expression?.name
        ) &&
        forStatement.conditionExpression.right?.memberName === "length"
    ) {
        logMessage(
            "recommended to cache length of array in for loop condition to reduce gas .",
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/cache_array_length_in_for_loop.md",
            forStatement.loc,
            "high"
        );
    }
};

const namedReturnParameter = (functionDefinition) => {
    functionDefinition?.returnParameters?.forEach((returnParameter) => {
        if (returnParameter.name === null) {
            logMessage(
                "use named return to reduse gas",
                "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/named_return_parameter.md",
                returnParameter.loc,
                "warning"
            );
        }
    });
};

const useERC1155 = (inheritanceSpecifier) => {
    if (inheritanceSpecifier.baseName.namePath === "ERC721") {
        logMessage(
            "ERC1155 is a cheaper non-fungible token than ERC721",
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/gas%20optimizition%20rules/use_erc-1155_for_batch_operations.md",
            inheritanceSpecifier.loc,
            "warning"
        );
    }
};

const blankLineBetweenContracts = (sourceUnit) => {
    const contracts = sourceUnit.children.filter(
        (children) => children.type === "ContractDefinition"
    );
    for (let i = 0; i < contracts.length - 1; i++) {
        if (contracts[i].loc.end.line + 3 !== contracts[i + 1].loc.start.line) {
            console.log(
                `there should be 2 blank lines between the ${
                    contracts[i].name
                } and ${contracts[i + 1].name} contract.`,
                `(line: ${contracts[i].loc.end.line}, column: ${contracts[i].loc.end.column})`
            );
        }
    }
};

const checkLayoutOrder = (childrens) => {
    const expectedOrder = [
        "PragmaDirective",
        "ImportDirective",
        "EventDefinition",
        "ErrorDefinition",
        "InterfaceDefinition",
        "LibraryDefinition",
        "ContractDefinition",
    ];

    const actualOrder = childrens.map((element) => element.type);

    let lastIndex = -1;

    for (let i = 0; i < actualOrder.length; i++) {
        const type = actualOrder[i];
        const currentIndex = expectedOrder.indexOf(type);

        if (currentIndex === -1) {
            const message =
                `🚨 Unknown Type Alert 🚨\n\n` +
                `Encountered at Position: ${chalk.bold(i)}\n` +
                `Type: ${chalk.red.bold(type)}`;

            console.log(
                boxen(message, {
                    padding: 1,
                    margin: 1,
                    borderStyle: "double",
                    borderColor: "red",
                    backgroundColor: "#2b2b2b",
                })
            );
            return;
        }

        if (currentIndex < lastIndex) {
            const message =
                `⚠️ ${chalk.bold("Order Error")} ⚠️\n\n` +
                `Error: ${chalk.red.bold(type)} at position ${chalk.bold(
                    i
                )} is out of order.\n` +
                `It should appear after ${chalk.yellow.bold(
                    expectedOrder[lastIndex]
                )}.\n\n` +
                `${chalk.cyan.underline("Learn more:")}\n` +
                `https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/layout_order.md`;

            console.log(
                boxen(message, {
                    padding: 1,
                    margin: 1,
                    borderStyle: "round",
                    borderColor: "yellow",
                })
            );
            return;
        }

        lastIndex = currentIndex;
    }

    return;
};

const checkContractOrder = (components) => {
    const expectedOrder = [
        "StructDefinition",
        "EnumDefinition",
        "StateVariableDeclaration",
        "EventDefinition",
        "CustomErrorDefinition",
        "ModifierDefinition",
        "FunctionDefinition",
    ];
    let lastIndex = -1;
    let lastType = "";

    for (let component of components) {
        const currentType = component.type;
        const currentIndex = expectedOrder.indexOf(currentType);

        if (currentIndex === -1) {
            const message =
                `⚠️ ${chalk.bold("Unknown Type Detected")} ⚠️\n\n` +
                `Type: ${chalk.red.bold(currentType)}`;

            console.log(
                boxen(message, {
                    padding: 1,
                    margin: 1,
                    borderStyle: "round",
                    borderColor: "red",
                    backgroundColor: "#2e2e2e",
                })
            );
            continue;
        }

        if (currentIndex < lastIndex) {
            const message =
                `🚨 ${chalk.bold("Ordering Error")} 🚨\n\n` +
                `Error: ${chalk.red.bold(currentType)} is out of order.\n` +
                `It should come after ${chalk.yellow.bold(lastType)}.\n\n` +
                `${chalk.cyan.underline("Learn more:")}\n` +
                `https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/check_contract_order.md`;

            console.log(
                boxen(message, {
                    padding: 1,
                    margin: 1,
                    borderStyle: "round",
                    borderColor: "red",
                })
            );
            return;
        }

        lastIndex = currentIndex;
        lastType = currentType;
    }

    return;
};

const checkFunctionOrder = (functionsArray) => {
    const functionOrder = [
        "constructor",
        "receive function",
        "fallback function",
        "external",
        "public",
        "internal",
        "private",
    ];

    const getOrder = (func) => {
        if (func.isConstructor) return 0;
        if (func.isReceiveEther) return 1;
        if (func.isFallback) return 2;
        switch (func.visibility) {
            case "external":
                return 3;
            case "public":
                return 4;
            case "internal":
                return 5;
            case "private":
                return 6;
            default:
                return 7;
        }
    };

    const sortedArray = [...functionsArray].sort(
        (a, b) => getOrder(a) - getOrder(b)
    );

    let wrongFunctionOrder = false;
    for (let i = 0; i < functionsArray.length; i++) {
        if (functionsArray[i] !== sortedArray[i]) {
            wrongFunctionOrder = true;
            break;
        }
    }
    if (wrongFunctionOrder) {
        const message =
            `⚠️ ${chalk.bold("Function Order Error")} ⚠️\n\n` +
            `${chalk.red("Your function order is wrong!")}\n\n` +
            `${chalk.cyan.underline("Learn more:")}\n` +
            `https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/check_function_order.md`;

        console.log(
            boxen(message, {
                padding: 1,
                margin: 1,
                borderStyle: "round",
                borderColor: "yellow",
            })
        );
    }
};

const checkName = (type, name, loc, nameCase, link) => {
    if (name.length < 2) {
        logMessage(
            `choose more meaningful name for your variables, functions, contracts etc.`,
            loc,
            link,
            "info"
        );
    }
    if (name.endsWith("_")) {
        name = name.slice(0, -1);
    }
    if (!checkStringCase(name, nameCase)) {
        logMessage(
            `${type} name "${name}" should be ${nameCase}!`,
            link,
            loc,
            "info"
        );
    }
};

const checkStateVariableUnderscorePrefix = (stateVariableDeclaration) => {
    if (
        stateVariableDeclaration.variables[0].visibility !== "public" &&
        !stateVariableDeclaration.variables[0].name.startsWith("_")
    ) {
        logMessage(
            "recommended to use underscore prefix for your private/internal state variables.",
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/state-variable-underscore-prefix.md",
            stateVariableDeclaration.variables[0].loc,
            "info"
        );
    } else if (
        stateVariableDeclaration.variables[0].visibility === "public" &&
        stateVariableDeclaration.variables[0].name.startsWith("_")
    ) {
        logMessage(
            "recommended to use underscore prefix for your private/internal state variables not public or externals.",
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/state-variable-underscore-prefix.md",
            stateVariableDeclaration.variables[0].loc,
            "info"
        );
    }
};
const checkStateVariableName = (stateVariableDeclaration) => {
    if (!stateVariableDeclaration.variables[0].isDeclaredConst) {
        checkName(
            "state variable",
            stateVariableDeclaration.variables[0].name,
            stateVariableDeclaration.variables[0].loc,
            CaseType.MIXED_CASE,
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/check_state_variable_name.md"
        );
    } else {
        checkName(
            "constant variable",
            stateVariableDeclaration.variables[0].name,
            stateVariableDeclaration.variables[0].loc,
            CaseType.UPPER_CASE,
            ""
        );
    }
};

const checkFunctionUnderscorePrefix = (functionDefinition) => {
    if (
        ["private", "internal"].includes(functionDefinition.visibility) &&
        !functionDefinition.name.startsWith("_")
    ) {
        logMessage(
            "recommended to use underscore prefix for your private/internal functions.",
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/check_function_underscore_prefix.md",
            functionDefinition.loc,
            "info"
        );
    } else if (
        !["private", "internal"].includes(functionDefinition.visibility) &&
        functionDefinition.name.startsWith("_")
    ) {
        logMessage(
            "recommended to use underscore prefix for your private/internal functions not public/external.",
            "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/check_function_underscore_prefix.md",
            functionDefinition.loc,
            "info"
        );
    }
};

const analyzeSolidityAST = (ast, stateVariableNames) => {
    parser.visit(ast, {
        SourceUnit: (sourceUnit) => {
            checkLayoutOrder(sourceUnit.children);
        },
        StateVariableDeclaration: (stateVariableDeclaration) => {
            specifyStateVariableVisibility(
                stateVariableDeclaration,
                stateVariableNames
            );
            checkStateVariableUnderscorePrefix(stateVariableDeclaration);
            checkStateVariableName(stateVariableDeclaration);
        },
        FunctionDefinition: (functionDefinition) => {
            if (!functionDefinition.isConstructor) {
                checkFunctionUnderscorePrefix(functionDefinition);
                checkName(
                    "function",
                    functionDefinition.name,
                    functionDefinition.loc,
                    CaseType.MIXED_CASE,
                    "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/check_function_name.md"
                );
            }
            functionDefinition.parameters.forEach((parameter) => {
                if (parameter.name.startsWith("_")) {
                    parameter.name = parameter.name.substring(1);
                }
                checkName(
                    "function parameter",
                    parameter.name,
                    parameter.loc,
                    CaseType.MIXED_CASE,
                    "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/check_function_parameter_name.md"
                );
            });
            namedReturnParameter(functionDefinition);
            specifyFunctionVisibility(functionDefinition, stateVariableNames);
            useCalldataInsteadMemory(functionDefinition);
            cacheVariable(stateVariableNames, functionDefinition);
            checkReentrancy(functionDefinition, stateVariableNames);
        },
        MemberAccess: (memberAccess) => {
            avoidUseTxOrigin(memberAccess);
            avoidUseBlockTimestamp(memberAccess);
        },
        VariableDeclarationStatement: (variableDeclarationStatement) => {
            checkReturnedValue(variableDeclarationStatement);
            if (!variableDeclarationStatement.variables[0].isDeclaredConst) {
                checkName(
                    "variable",
                    variableDeclarationStatement.variables[0].name,
                    variableDeclarationStatement.variables[0].loc,
                    CaseType.MIXED_CASE,
                    "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/check_variable_name.md"
                );
            } else {
                checkName(
                    "constant variable",
                    variableDeclarationStatement.variables[0].name,
                    variableDeclarationStatement.variables[0].loc,
                    CaseType.UPPER_CASE,
                    ""
                );
            }
        },
        ExpressionStatement: (expressionStatement) => {
            useCustomError(expressionStatement);
            checkReturnValue(expressionStatement);
            incAndDecOneOperation(expressionStatement);
        },
        VariableDeclaration: (variableDeclaration) => {
            dontUseAbbreviations(variableDeclaration);
        },
        BinaryOperation: (binaryOperation) => {
            checkBinaryOperation(binaryOperation);
        },
        EventDefinition: (eventDefinition) => {
            indexedEvents(eventDefinition);
        },
        ForStatement: (forStatement) => {
            cacheLengthInForStatement(forStatement);
        },
        InheritanceSpecifier: (inheritanceSpecifier) => {
            useERC1155(inheritanceSpecifier);
        },
        ContractDefinition: (contractDefinition) => {
            checkContractOrder(contractDefinition.subNodes);
            const functions = contractDefinition.subNodes.filter(
                (node) => node.type === "FunctionDefinition"
            );
            checkFunctionOrder(functions);
            checkName(
                contractDefinition.kind,
                contractDefinition.name,
                contractDefinition.loc,
                CaseType.CAP_WORD,
                "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/check_contract_name.md"
            );
        },
        StructDefinition: (structDefinition) => {
            checkName(
                "struct",
                structDefinition.name,
                structDefinition.loc,
                CaseType.CAP_WORD,
                "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/check_struct_name.md"
            );
        },
        EventDefinition: (eventDefinition) => {
            checkName(
                "event",
                eventDefinition.name,
                eventDefinition.loc,
                CaseType.CAP_WORD,
                "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/check_event_name.md"
            );
        },
        ModifierDefinition: (modifierDefinition) => {
            checkName(
                "modifire",
                modifierDefinition.name,
                modifierDefinition.loc,
                CaseType.MIXED_CASE,
                "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/check_modifier_name.md"
            );
        },
        EnumDefinition: (enumDefinition) => {
            checkName(
                "enum",
                enumDefinition.name,
                enumDefinition.loc,
                CaseType.CAP_WORD,
                "https://github.com/soroush-khoshnoudi/Solidera/blob/main/docs/style%20guide%20rules/check_enum_name.md"
            );
        },
    });
};

const main = () => {
    const solidityCode = readSolidityFile(solidityFilePath);

    let solidityAST;
    try {
        solidityAST = parser.parse(solidityCode, { loc: true, tolerant: true });
    } catch (err) {
        console.error("Error parsing Solidity code:", err);
        process.exit(1);
    }

    if (enableAST) {
        const contractFileName = path.basename(
            solidityFilePath,
            path.extname(solidityFilePath)
        );
        writeJsonToFile(contractFileName + "AST" + ".json", solidityAST);
    }

    const stateVariableNames = [];
    analyzeSolidityAST(solidityAST, stateVariableNames);

    console.log(
        boxen(`${chalk.green.bold("✅ Analysis Complete")} 🎉`, {
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "green",
            backgroundColor: "#f0f0f0",
        })
    );
};

main();
