from os import listdir
from os.path import isfile, join
import csv
import re
from typing import Dict, List, Tuple

Datum = Dict[str, float]

def get_single(convergenceRate, learningRate) -> List[Datum]:
    data = []
    conv = "{0:.2f}".format(convergenceRate)
    learn = "{0:.2f}".format(learningRate)
    file = "convergencerate-" + conv + "_learningrate-" + learn + ".csv"
    path = join("data", file)
    with open(path, 'r', newline="") as csvfile:
        reader = csv.DictReader(csvfile, ["time", "fitnessSums0", "fitnessSums1", "fitnessSums2", "avgFitnessSums0", "avgFitnessSums1", "avgFitnessSums2"])
        for i, row in enumerate(reader):
            if i == 0: continue
            d = {
                "time": float(row["time"]),
                "fitnessSums0": float(row["fitnessSums0"]),
                "fitnessSums1": float(row["fitnessSums1"]),
                "fitnessSums2": float(row["fitnessSums2"]),
                "avgFitnessSums0": float(row["avgFitnessSums0"]),
                "avgFitnessSums1": float(row["avgFitnessSums1"]),
                "avgFitnessSums2": float(row["avgFitnessSums2"]),
            }
            data.append(d)
    return data

def get_finals() -> Dict[Tuple[float, float], Datum]:
    data = {}
    with open("data.csv", 'r', newline="") as csvfile:
        reader = csv.DictReader(csvfile, ["convergenceRate", "learningRate", "fitnessSums0", "fitnessSums1", "fitnessSums2", "avgFitnessSums0", "avgFitnessSums1", "avgFitnessSums2"])
        for row in reader:
            conv = float(row["convergenceRate"])
            learn = float(row["learningRate"])
            data[(conv, learn)] = {
                "fitnessSums0": float(row["fitnessSums0"]),
                "fitnessSums1": float(row["fitnessSums1"]),
                "fitnessSums2": float(row["fitnessSums2"]),
                "avgFitnessSums0": float(row["avgFitnessSums0"]),
                "avgFitnessSums1": float(row["avgFitnessSums1"]),
                "avgFitnessSums2": float(row["avgFitnessSums2"]),
            }

    return data

def save_finals():
    data = get_finals()
    with open("data.csv", 'w', newline="") as csvfile:
        writer = csv.DictWriter(csvfile, ["convergenceRate", "learningRate", "fitnessSums0", "fitnessSums1", "fitnessSums2", "avgFitnessSums0", "avgFitnessSums1", "avgFitnessSums2"])
        for key in data:
            row = data[key]
            del row["time"]
            row["convergenceRate"] = key[0]
            row["learningRate"] = key[1]
            writer.writerow(row)

def get_data() -> Dict[Tuple[float, float], List[Datum]]:
    files = [f for f in listdir("data") if isfile(join("data", f))]
    data = {}

    for file in files:
        match = re.match("convergencerate-([\\d\\.]+)_learningrate-([\\d\\.]+)\\.csv", file)
        if not match:
            exit()
        convergenceRate = float(match.groups()[0])
        learningRate = float(match.groups()[1])
        key = (convergenceRate, learningRate)
        data[key] = get_single(convergenceRate, learningRate)

    return data
