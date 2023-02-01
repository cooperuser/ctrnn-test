import matplotlib.pyplot as plt
from load import get_data

data, data_dict = get_data()

def get_y_0(datum):
    return datum["a2"] + datum["a1"] + datum["a0"]

def get_y_1(datum):
    return datum["a2"]

plt.ylabel("avg activity")
plt.xlabel("initial amplitude")
plt.scatter(
    data.keys(),
    [get_y_0(data[d][-1]) for d in data]
)
plt.scatter(
    data.keys(),
    [get_y_1(data[d][-1]) for d in data]
)
plt.show()
