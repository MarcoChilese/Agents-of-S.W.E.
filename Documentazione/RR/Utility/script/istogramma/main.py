import plot_generator as pg

plot_title = 'Totale ore con investimento'   # il grafo si salva con questo nome
y_label = 'ore'
x_values = ['Marco Chilese', 'Marco Favaro', 'Diego Mazzalovo',
            'Carlotta Segna', 'Matteo Slanzi', 'Bogdan Stanciu', 'Luca Violato']
colors = ["#9DA1AA", "#C51D34", "#415A66", "#7ECCFD", "#57A639", "#F5D033"] 

d = {
    'Responsabile': [8, 14, 8, 11, 9, 22, 14],
    'Amministratore': [15, 11, 8, 17, 8, 8, 22],
    'Analista': [22, 29, 25, 10, 26, 22, 12],
    'Progettista': [23, 14, 29, 22, 25, 31, 16],
    'Programmatore': [26, 22, 37, 38, 35, 22, 31],
    'Verificatore': [41, 45, 28, 37, 32, 30, 40]
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