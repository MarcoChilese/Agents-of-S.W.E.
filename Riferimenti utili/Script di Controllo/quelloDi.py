# -*- coding: utf-8 -*-

# Usage: python3 quelloDi.py PATH REV   
# REV --> RR or RP or RQ

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
                        if line.find("quello di", 0, len(line)) != -1:
                            totalErrors += 1
                            report.write("\"quello di \" found in "+folder+"/"+file+" at line "+str(i)+": "+line+"\n\n")         
                        i = i+1
    report.write("\n\n Total Errors: "+str(totalErrors))        