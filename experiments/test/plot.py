import matplotlib.pyplot as plt
from load import get_finals

data = get_finals()

heatmap = []
for conv in range(100):
    row = []
    for learn in range(100):
        d = data[(conv / 10, learn / 10)]
        row.append(d["fitnessSums0"] + d["fitnessSums1"] + d["fitnessSums2"])
    heatmap.append(row)

plt.imshow(heatmap, cmap="hot", interpolation="nearest")
plt.ylabel("convergence_rate")
plt.xlabel("learning_rate")
plt.show()
