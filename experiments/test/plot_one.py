import matplotlib.pyplot as plt
from load import get_single

data = get_single(0.1, 1.0)

plt.ylabel("avg activity")
plt.xlabel("initial amplitude")
plt.plot([d["fitnessSums0"] for d in data])
plt.plot([d["fitnessSums1"] for d in data])
plt.plot([d["fitnessSums2"] for d in data])
plt.plot([d["fitnessSums0"] + d["fitnessSums1"] for d in data])
plt.show()
