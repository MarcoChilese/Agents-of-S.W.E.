import os
import sys

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


def plot_generator(plot_title, y_label, x_values, colors, d, width):
    if not os.path.exists('images'):
        os.makedirs('images')
    
    try:
        data = pd.DataFrame(data=d)
    except:
        print("VALUES ERROR: Tutti i valori devono avere la stessa lunghezza")
        sys.exit()
    
    columns = len(data.index)

    if columns != len(x_values):
        print("X LABELS ERROR: X axis indexes are not the same number of columns in the graph")
        sys.exit()

    if len(colors) != len(data.columns):
        print("COLORS ERROR: The colors defined are not the same number of the data")
        sys.exit()

    plt.gcf().subplots_adjust(bottom=0.15)
    lower_base = np.zeros(columns)
    ind = np.arange(columns)    # the x locations for the groups

    plot_info = []
    i = 0

    for index in data:
        plot_info.append(
            plt.bar(ind, data[index], width, color=colors[i], bottom=lower_base))
        lower_base += data[index]
        i += 1

    plt.ylabel(y_label)
    plt.title(plot_title)
    plt.xticks(ind, x_values,rotation = 20)
    plt.yticks(np.arange(0, sum(data.max()+10),10))

    legend = []
    for index in plot_info:
        legend.append(index[0])

    plt.legend(legend, data.columns.values)

    plt.savefig('images/fig_{}.png'.format(plot_title))
