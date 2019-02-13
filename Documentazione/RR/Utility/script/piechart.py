import matplotlib.pyplot as plt
import plotly.plotly as py

#avvio ed analisi e validazione e collaudo

# Data to plot
labels = 'Responsabile', 'Amministratore', 'Analista', 'Progettista', 'Programmatore' ,'Verificatore'
sizes = [73,91,153,169,195,229]
colors = ["#9DA1AA", "#C51D34", "#415A66", "#7ECCFD", "#57A639" ,"#F5D033"] 

explode = (0, 0, 0, 0, 0, 0) 
# Plot 
plt.pie(sizes, colors=colors, labels=labels, radius = 1.2, autopct = '%1.1f%%')

plt.axis('equal')
plt.show()

# Responsabile: #9DA1AA
# Amministratore: #C51D34
# Analista: #415A66
# Progettista: #7ECCFD
# Programmatore: #57A639
# Verificatore: #F5D033 