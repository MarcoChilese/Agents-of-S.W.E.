import plot_generator as pg

plot_title = 'Totale ore con Investimento'   # il grafo si salva con questo nome
y_label = 'ore'
x_values = ['Marco Chilese', 'Marco Favaro', 'Diego Mazzalovo',
            'Carlotta Segna', 'Matteo Slanzi', 'Bogdan Stanciu', 'Luca Violato']
colors = ["#9DA1AA", "#C51D34", "#415A66", "#7ECCFD", "#57A639", "#F5D033"] 

d = {
    'Responsabile': [10,14,10,13,10,22,14],
    'Amministratore': [15,10,11,18,10,10,22],
    'Analista': [14,34,25,15,15,35,20],
    'Progettista': [32,14,35,10,32,26,19],
    'Programmatore': [16,19,35,48,33,12,31],
    'Verificatore': [48,44,19,31,35,30,29]
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