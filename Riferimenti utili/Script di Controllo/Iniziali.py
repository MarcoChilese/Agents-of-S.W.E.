# -*- coding: utf-8 -*-

# Usage: python Iniziali.py PATH

import os
import sys

rootdir = sys.argv[1]
totalErrors = 0

def getSection(line):
    return line.find("\\section{", 0, len(line))

def getSubsection(line):
    return line.find("\\subsection{", 0, len(line))

def getSubsubsection(line):
    return line.find("\\subsubsection{", 0, len(line))

def getParagraph(line):
    return line.find("\\paragraph{", 0, len(line))

def checkTitle(line):
    openB = line.find("{", 0, len(line))
    closeB = line.find("}", 0, len(line))
    title = line[openB+1: closeB]
    return checkCapitalLetters(title)

congiunzioni = ["di", "a", "e", "con", "su", "per", "tra", "fra", "che", "o", "dei", "i", "la", "gli", "le", "del", "della", "il", "li", "un", "uno", "una", "un'", "l'"]
def checkCapitalLetters(title):
    words = title.split(" ")
    for word in words:
        if word not in congiunzioni:
            if word[0].isupper() == False:
                return False
    return True

with open(os.path.join(rootdir, 'report.txt'), 'w') as report:
    for folder, subs, files in os.walk(rootdir):
        if "Glossario" in folder.split("/") or "Verbali" in folder.split("/"): continue 
        for file in files:
            if os.path.splitext(folder+"/"+file)[1] == ".tex":
                with open(os.path.join(folder, file), 'r') as src:
                    atLine = 1
                    for line in src:
                        if getSection(line) != -1 or getSubsection(line) != -1 or getSubsubsection(line) != -1 or getParagraph(line) != -1:
                            if checkTitle(line) != True: 
                                totalErrors += 1
                                report.write("Error in: "+folder+"/"+file+" at line: "+str(atLine)+"\n\n")                                    
                        atLine += 1
    report.write("\n\nTotal Errors: "+str(totalErrors))        
