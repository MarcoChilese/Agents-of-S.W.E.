# -*- coding: utf-8 -*-

# Usage: python accenti.py PATH REV   
# REV --> RR or RP...

import os
import sys

rootdir = sys.argv[1]
revisione = sys.argv[2]
totalErrors = 0

with open(os.path.join(rootdir, 'report.txt'), 'w') as report:
    for folder, subs, files in os.walk(rootdir):
        path = folder.split("/")
        if ("Glossario" in path) or ("Verbali" in path) or (".git" in path) or (revisione not in path): continue 
        for file in files:
            if os.path.splitext(folder+"/"+file)[1] == ".tex":
                with open(os.path.join(folder, file), 'r') as src:
                    i = 1
                    for line in src:
                        if line.find("\\\'E", 0, len(line)) != -1:
                            totalErrors += 1
                            report.write("Error in "+folder+"/"+file+" at line "+str(i)+": \\\'E => È\n\n")
                        if line.find(" é ", 0, len(line)) != -1:
                            totalErrors += 1
                            report.write("Error in "+folder+"/"+file+" at line "+str(i)+":  é => è\n\n")
                        if line.find("perché ", 0, len(line)) != -1:
                            totalErrors += 1
                            report.write("Error in "+folder+"/"+file+" at line "+str(i)+":  perché => perchè\n\n")        
                        if line.find("nonchè", 0, len(line)) != -1:
                            totalErrors += 1
                            report.write("Error in "+folder+"/"+file+" at line "+str(i)+":  nonchè => nonché\n\n")        
                        if line.find("poichè ", 0, len(line)) != -1:
                            totalErrors += 1
                            report.write("Error in "+folder+"/"+file+" at line "+str(i)+":  poichè => poiché\n\n")           
                        i = i+1
    report.write("\n\n Total Errors: "+str(totalErrors))        