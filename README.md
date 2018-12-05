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
