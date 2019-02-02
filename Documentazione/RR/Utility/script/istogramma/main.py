import plot_generator as pg

plot_title = 'Totale ore con Investimento'   # il grafo si salva con questo nome
y_label = 'ore'
x_values = ['Marco Chilese', 'Marco Favaro', 'Diego Mazzalovo',
            'Carlotta Segna', 'Matteo Slanzi', 'Bogdan Stanciu', 'Luca Violato']
colors = ["#9DA1AA", "#C51D34", "#415A66", "#7ECCFD", "#57A639", "#F5D033"] 

d = {
    'Responsabile': [8,8,8,13,8,20,8],
    'Amministratore': [13,10,11,17,10,10,20],
    'Analista': [13,36,23,15,13,33,20],
    'Progettista': [32,14,35,10,31,25,22],
    'Programmatore': [16,19,34,46,35,12,33],
    'Verificatore': [48,43,19,29,33,30,27]
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