# -*- coding: utf-8 -*-

# Usage: python accenti.py PATH

import os
import sys

rootdir = sys.argv[1]
totalErrors = 0

with open(os.path.join(rootdir, 'report.txt'), 'w') as report:
    for folder, subs, files in os.walk(rootdir):
        for file in files:
            if os.path.splitext(folder+"/"+file)[1] == ".tex":
                with open(os.path.join(folder, file), 'r') as src:
                    i = 1
                    for line in src:
                        eAccentataMaiuscola = line.find("\\\'E", 0, len(line))
                        eAccentataMinuscola = line.find(" é ", 0, len(line))
                        perche = line.find("perché ", 0, len(line))
                        poiche = line.find("perché ", 0, len(line))
                        nonche = line.find("poichè", 0, len(line))
                        if eAccentataMaiuscola != -1:
                            totalErrors += 1
                            report.write("Error in "+folder+"/"+file+" at line "+str(i)+": \\\'E => È\n\n")
                        if eAccentataMinuscola != -1:
                            totalErrors += 1
                            report.write("Error in "+folder+"/"+file+" at line "+str(i)+":  é => è\n\n")
                        if perche != -1:
                            totalErrors += 1
                            report.write("Error in "+folder+"/"+file+" at line "+str(i)+":  perché => perchè\n\n")        
                        if nonche != -1:
                            totalErrors += 1
                            report.write("Error in "+folder+"/"+file+" at line "+str(i)+":  nonchè => nonché\n\n")        
                        if poiche != -1:
                            totalErrors += 1
                            report.write("Error in "+folder+"/"+file+" at line "+str(i)+":  poichè => poiché\n\n")           
                        i = i+1
    report.write("\n\n Total Errors: "+str(totalErrors))        