import plot_generator as pg

plot_title = 'Totale ore Rendicontate'   # il grafo si salva con questo nome
y_label = 'ore'
x_values = ['Marco Chilese', 'Marco Favaro', 'Diego Mazzalovo',
            'Carlotta Segna', 'Matteo Slanzi', 'Bogdan Stanciu', 'Luca Violato']
colors = ["#9DA1AA", "#C51D34", "#415A66", "#7ECCFD", "#57A639", "#F5D033"] 

d = {
    'Responsabile': [10,12,10,0,10,5,13],
    'Amministratore': [13,10,11,17,0,10,5],
    'Analista': [3,18,5,15,5,23,10],
    'Progettista': [32,14,33,10,32,25,19],
    'Programmatore': [16,19,34,46,32,12,31],
    'Verificatore': [31,32,12,17,26,30,27]
}

width = 0.70       # the width of the bars: can also be len(x) sequence

if __name__ == "__main__":
    pg.plot_generator(plot_title, y_label, x_values, colors, d, width)

# Responsabile: #9DA1AA
# Amministratore: #C51D34
# Analista: #415A66
# Progettista: #7ECCFD
# Programmatore: #57A639
# Verificatore: #F5D033 