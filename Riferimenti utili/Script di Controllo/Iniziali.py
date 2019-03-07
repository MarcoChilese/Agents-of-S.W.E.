# -*- coding: utf-8 -*-

# Usage: python Iniziali.py PATH REV
# REV --> RR or RP...

import os
import sys
import re

rootdir = sys.argv[1]
revisione = sys.argv[2]
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
    title = title.replace('\"', '') 
    title = title.replace('\\textit{', '')
    title = title.replace('}', '')
    return checkCapitalLetters(title)


congiunzioni = ["di", "a", "e", "con", "su", "per", "tra", "fra", "che", "o", "dei", "i", "la", "gli", "le", "del", "della", "il", "li", "un", "uno", "una", "un'", "l'", "non", "delle", "degli", "d'Uso", "al", "agli", "alle", "ai", "-", "\""]
def checkCapitalLetters(title):
    words = title.split(" ")
    for word in words:
        if word not in congiunzioni:
            try:
                if word[0].isupper() == False:
                    return False
            except IndexError:
                print(word)
    return True

with open(os.path.join(rootdir, 'report.txt'), 'w') as report:
    for folder, subs, files in os.walk(rootdir):
        path = folder.split("/")
        if ("Glossario" in path) or ("Verbali" in path) or (".git" in path) or (revisione not in path): continue 
        for file in files:
            if os.path.splitext(folder+"/"+file)[1] == ".tex":
                with open(os.path.join(folder, file), 'r') as src:
                    atLine = 1
                    for line in src:
                        if getSection(line) != -1 or getSubsection(line) != -1 or getSubsubsection(line) != -1 or getParagraph(line) != -1:
                            if checkTitle(line) != True: 
                                totalErrors += 1
                                report.write("Error in: "+folder+"/"+file+" at line: "+str(atLine)+".\n"+line+"\n\n")                                    
                        atLine += 1
    report.write("\n\nTotal Errors: "+str(totalErrors))        
