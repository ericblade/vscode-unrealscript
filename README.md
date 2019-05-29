# Task definitions

As of v0.0.2, this extension also provides default tasks for building code (ucc make), and running
the Unreal Editor.  If your game project uses the 'standard' unreal 1/2/3 paths 'System/UCC.exe'
and 'System/UnrealEd.exe', then they will be picked up automatically, and you can run them with
the >Run Tasks command.

Note that as most versions of UCC will not automatically detect changes to rebuild a package (.u)
file, simply running the UCC make task will not build your new code -- you must delete or rename
the System/PackageName.u file before UCC make will rebuild the code.

## Building UnrealScript code packages

See [https://wiki.beyondunreal.com/Legacy:Compiling_With_UCC] for troubleshooting.
Make sure that your game's INI file has your package name listed in the EditPackages lines,
and that you do NOT have a System/YourPackageName.u file present.  Use "Run Tasks" then select
ucc make.

## Running the UnrealEd editor

If your game project has an editor installed as System/UnrealEd.exe then you can run that from
VS Code using "Run Tasks" then select UnrealEd.

## Troubleshooting problems with UnrealEd or UCC tasks

Some games may have shipped with alternate configurations for use with the Editor or UCC, and
require running a separate batch file or adding command line parameters to use their editor or UCC
package properly.

An example for a game such as Land of the Dead, which provided a separate set of INI files to use
for the editor might be, setting up a .vscode/tasks.json file which contains:

````
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Unreal Editor",
            "type": "shell",
            "command": "./system/UnrealEd.exe ini=DevLOTD.ini USERINI=DevUser.ini"
        }
    ]
}
````

## Game and server launch tasks

While these are not presently auto-detected (there is no universal .exe name for game mode, nor
an obvious way to detect if a game has support to be run as a server), you can launch the game
from a custom task:

````
{
    "version": "2.0.0",
    "tasks": {
        {
            "label": "Some Unreal Game",
            "type": "shell",
            "command": "./system/game.exe -windowed -log"
        }
    }
}
````

or to launch a dedicated server

````
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Game Dedicated Server",
            "type": "shell",
            "command": "./system/ucc.exe server mapname"
        }
    ]
}
````

... refer to your specific game for possible additional command lines that may be used.  An
example for Land of the Dead might be:
````
"command": "./system/ucc.exe server INFarm?Game=DOTZGame.DOTZInvasion?EnemyStrength=2?FriendlyFire=True INI=server.ini LOG=server.log"
````

# Debugging

It is not likely that this extension will ever support debugging, however it may be possible with
Unreal 3/UDK, and there may be other games that did support debugging.  You can, still, however,
setup VS Code's debug launcher system to launch instances of your game.

If someone wants to attempt to work out how to actually debug UnrealScript in UDK, or interface with
older engine debug tech, you might start at
https://api.unrealengine.com/udk/Three/DebuggerInterface.html


# UnrealScript language support for VSCode

While UnrealScript is not really in use anymore, there are still a lot of modders out there that are
probably using it.  I occasionally need to dig through some old UnrealScript code, and doing it
without code highlighting support is pretty obnoxious.  So, I've taken the Java language file (some
people may remember that UnrealScript is sort of derived from Java) and added it to the language
support as UnrealScript for .uc files.

To be honest, this is just a very quick hack, applying the general Javascript language rules, and
the Java grammar rules, as UnrealScript shares quite a lot of those.  It definitely makes it a lot
easier to read old UC code in VScode.

I would be happy to accept any pull requests, if there's anyone out there that understands the
.tmLanguage.json files, and has knowledge of UnrealScript to improve the grammar.  I took a couple
of stabs at it, but it's not really something I have time to mess with.

Good luck!
Enjoy!
Be Awesome!
