import matplotlib.pyplot as plt
from load import get_data

data = get_data()

heatmap = []
for conv in range(20):
    row = []
    for learn in range(20):
        data_list = data[(conv / 10, learn / 10)]
        total = sum([d["fitnessSums0"] + d["fitnessSums1"] + d["fitnessSums2"] for d in data_list])
        row.append(total / 10)
    heatmap.append(row)

plt.imshow(heatmap, cmap="hot", interpolation="nearest")
plt.ylabel("convergence_rate")
plt.xlabel("learning_rate")
plt.show()
