// TODO: we can probably write a file system provider that would allow us to use the real file
// system as a backing store, but prevent people from being able to write to directories that
// are in a blacklist (ie "Engine/*")
// https://github.com/microsoft/vscode-extension-samples/tree/master/fsprovider-sample/src

// TODO: upon activation, extensionHostProcess.js:630 complains:
// The Task [ucc, UCC make] uses an undefined task type.  The task will be ignored in the future.
// The Task [unrealed, Unreal Editor] uses an undefined task type. The task will be ignored in the
// future.
// ... vscode.tasks.registerTaskProvider(type, ...) seems to be the source of those -- is this
// an error in vscode api, or is there a specific type they are looking for here?  the sample
// code uses 'rake' as both registerTaskProvider type and Task type, and that seems to work.


import * as path from 'path';
import * as fs from 'fs';
// import * as cp from 'child_process';
import * as vscode from 'vscode';

let taskProvider: vscode.Disposable | undefined;

// defined as taskDefinitions type in package.json
// 123 means unreal 1, 2, or 3. unreal 4 is completely different.
const TASK_TYPE = 'unreal123';

export function activate(_context: vscode.ExtensionContext): void {
    console.warn('************* ucc extension activated');
    let workspaceRoot = vscode.workspace.rootPath;
    if (!workspaceRoot) {
        console.warn('* no workspaceRoot');
        return;
    }
    let uccPromise: Thenable<vscode.Task[]> | undefined = undefined;
    taskProvider = vscode.tasks.registerTaskProvider(TASK_TYPE, {
        provideTasks: () => {
            if (!uccPromise) {
                uccPromise = getUccTask();
            }
            return uccPromise;
        },
        resolveTask(_task: vscode.Task): vscode.Task | undefined {
            return undefined;
        }
    });
}

export function deactivate(): void {
    if (taskProvider) {
        taskProvider.dispose();
    }
}

function exists(file: string): Promise<boolean> {
    return new Promise<boolean>((resolve, _reject) => {
        fs.exists(file, (value) => {
            resolve(value);
        });
    });
}

let _channel: vscode.OutputChannel;
function getOutputChannel(): vscode.OutputChannel {
    if (!_channel) {
        _channel = vscode.window.createOutputChannel('UCC Auto Detection');
    }
    return _channel;
}

interface UnrealTaskDefinition extends vscode.TaskDefinition {
    task: string;
}

async function getUccTask(): Promise<vscode.Task[]> {
    let workspaceRoot = vscode.workspace.rootPath || '';
    let tasks: vscode.Task[] = [];
    let uccFile = path.join(workspaceRoot, 'system/UCC.exe');
    if (!await exists(uccFile)) {
        console.warn(`***** No UCC.exe found at ${uccFile}`);
        getOutputChannel().appendLine(`No UCC.exe found at ${uccFile}`);
    } else {
        console.warn(`**** UCC found at ${uccFile}`);
        getOutputChannel().appendLine(`UCC found at ${uccFile}`);
        let kind: UnrealTaskDefinition = {
            type: TASK_TYPE,
            task: 'ucc make',
        };
        let makeTask = new vscode.Task(kind, 'UCC make', 'ucc', new vscode.ShellExecution(`"${uccFile}" make`));
        makeTask.group = vscode.TaskGroup.Build;
        tasks.push(makeTask);
    }

    let unrealEdFile = path.join(workspaceRoot, 'system/UnrealEd.exe');
    if (!await exists(unrealEdFile)) {
        console.warn(`**** No UnrealEd.exe found at ${unrealEdFile}`);
        getOutputChannel().appendLine(`No UnrealEd.exe found at ${unrealEdFile}`);
    } else {
        console.warn(`**** UnrealEd found at ${unrealEdFile}`);
        getOutputChannel().appendLine(`UnrealEd found at ${unrealEdFile}`);
        let kind: UnrealTaskDefinition = {
            type: TASK_TYPE,
            task: 'unrealed',
        };
        let editorTask = new vscode.Task(kind, 'Unreal Editor', 'unrealed', new vscode.ShellExecution(`"${unrealEdFile}"`));
        tasks.push(editorTask);
    }

    return tasks;
}
