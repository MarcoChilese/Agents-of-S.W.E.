# -*- coding: utf-8 -*-

# Usage: python accenti.py PATH

import os
import sys

rootdir = sys.argv[1]

with open(os.path.join(rootdir, 'report.txt'), 'w') as dest:
    for folder, subs, files in os.walk(rootdir):
        for file in files:
            if os.path.splitext(folder+"/"+file)[1] == ".tex":
                with open(os.path.join(folder, file), 'r') as src:
                    i = 1
                    for line in src:
                        eAccentataMaiuscola = line.find("\\\'E", 0, len(line))
                        eAccentataMinuscola = line.find("é", 0, len(line))
                        if eAccentataMaiuscola != -1:
                            dest.write("Error in "+folder+"/"+file+" at line "+str(i)+": \\\'E \n\n")
                        if eAccentataMinuscola != -1:
                            dest.write("Error in "+folder+"/"+file+" at line "+str(i)+":  é\n\n")
                        i = i+1