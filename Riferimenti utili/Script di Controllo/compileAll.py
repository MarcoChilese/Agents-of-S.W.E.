# -*- coding: utf-8 -*-

# Usage: python3 compileAll.py PATH REV   
# REV --> RR or RP or RQ

import os
import sys

rootdir = sys.argv[1]
revisione = sys.argv[2]


for folder, subs, files in os.walk(rootdir):
    path = folder.split("/")
    if ("Glossario" in path) or ("Verbali" in path) or (".git" in path) or (revisione not in path) or ("Chapters" in path) or ("UC XML draw.io" in path) or ("images" in path) or ("Config" in path) or ("umbrello" in path): continue 
    for file in files:
        if file == "structure.tex": continue
        if os.path.splitext(folder+"/"+file)[1] == ".tex":
            print("Compiling twice: ", file)
            currentDirectory = folder.replace(" ", "\ ")
            currentFile = file.replace(" ", "\ ")
            cd = "cd "+currentDirectory
            compile = "pdflatex "+currentDirectory+"/"+currentFile
            os.system(cd+" && "+compile+" && "+compile)
            print(file, " compiled! :)\n")
