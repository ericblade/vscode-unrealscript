"use strict";
// TODO: we can probably write a file system provider that would allow us to use the real file
// system as a backing store, but prevent people from being able to write to directories that
// are in a blacklist (ie "Engine/*")
// https://github.com/microsoft/vscode-extension-samples/tree/master/fsprovider-sample/src
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: upon activation, extensionHostProcess.js:630 complains:
// The Task [ucc, UCC make] uses an undefined task type.  The task will be ignored in the future.
// The Task [unrealed, Unreal Editor] uses an undefined task type. The task will be ignored in the
// future.
// ... vscode.tasks.registerTaskProvider(type, ...) seems to be the source of those -- is this
// an error in vscode api, or is there a specific type they are looking for here?  the sample
// code uses 'rake' as both registerTaskProvider type and Task type, and that seems to work.
const path = require("path");
const fs = require("fs");
// import * as cp from 'child_process';
const vscode = require("vscode");
let taskProvider;
// defined as taskDefinitions type in package.json
// 123 means unreal 1, 2, or 3. unreal 4 is completely different.
const TASK_TYPE = 'unreal123';
function activate(_context) {
    console.warn('************* ucc extension activated');
    let workspaceRoot = vscode.workspace.rootPath;
    if (!workspaceRoot) {
        console.warn('* no workspaceRoot');
        return;
    }
    let uccPromise = undefined;
    taskProvider = vscode.tasks.registerTaskProvider(TASK_TYPE, {
        provideTasks: () => {
            if (!uccPromise) {
                uccPromise = getUccTask();
            }
            return uccPromise;
        },
        resolveTask(_task) {
            return undefined;
        }
    });
}
exports.activate = activate;
function deactivate() {
    if (taskProvider) {
        taskProvider.dispose();
    }
}
exports.deactivate = deactivate;
function exists(file) {
    return new Promise((resolve, _reject) => {
        fs.exists(file, (value) => {
            resolve(value);
        });
    });
}
let _channel;
function getOutputChannel() {
    if (!_channel) {
        _channel = vscode.window.createOutputChannel('UCC Auto Detection');
    }
    return _channel;
}
function getUccTask() {
    return __awaiter(this, void 0, void 0, function* () {
        let workspaceRoot = vscode.workspace.rootPath || '';
        let tasks = [];
        let uccFile = path.join(workspaceRoot, 'system/UCC.exe');
        if (!(yield exists(uccFile))) {
            console.warn(`***** No UCC.exe found at ${uccFile}`);
            getOutputChannel().appendLine(`No UCC.exe found at ${uccFile}`);
        }
        else {
            console.warn(`**** UCC found at ${uccFile}`);
            getOutputChannel().appendLine(`UCC found at ${uccFile}`);
            let kind = {
                type: TASK_TYPE,
                task: 'ucc make',
            };
            let makeTask = new vscode.Task(kind, 'UCC make', 'ucc', new vscode.ShellExecution(`"${uccFile}" make`));
            makeTask.group = vscode.TaskGroup.Build;
            tasks.push(makeTask);
        }
        let unrealEdFile = path.join(workspaceRoot, 'system/UnrealEd.exe');
        if (!(yield exists(unrealEdFile))) {
            console.warn(`**** No UnrealEd.exe found at ${unrealEdFile}`);
            getOutputChannel().appendLine(`No UnrealEd.exe found at ${unrealEdFile}`);
        }
        else {
            console.warn(`**** UnrealEd found at ${unrealEdFile}`);
            getOutputChannel().appendLine(`UnrealEd found at ${unrealEdFile}`);
            let kind = {
                type: TASK_TYPE,
                task: 'unrealed',
            };
            let editorTask = new vscode.Task(kind, 'Unreal Editor', 'unrealed', new vscode.ShellExecution(`"${unrealEdFile}"`));
            tasks.push(editorTask);
        }
        return tasks;
    });
}
//# sourceMappingURL=extension.js.map