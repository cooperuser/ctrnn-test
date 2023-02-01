from os import listdir
from os.path import isfile, join
import csv
import re
from typing import Dict, List, Tuple

Datum = Dict[str, float]

def get_data() -> Tuple[Dict[float, List[Datum]], Dict[float, Dict[float, Datum]]]:
    files = [f for f in listdir("data") if isfile(join("data", f))]
    data = {}
    data_dict = {}

    for file in files:
        path = join("data", file)
        match = re.match(".*-([\\d\\.]+)\\.csv", file)
        if not match:
            exit()
        amplitude = float(match.groups()[0])
        data[amplitude] = []
        data_dict[amplitude] = {}

        with open(path, 'r', newline="") as csvfile:
            reader = csv.DictReader(csvfile, ["time", "a0", "a1", "a2"])
            for i, row in enumerate(reader):
                if i == 0: continue
                time = float(row["time"])
                a0 = float(row["a0"])
                a1 = float(row["a1"])
                a2 = float(row["a2"])
                d = {
                    "time": time,
                    "a0": a0,
                    "a1": a1,
                    "a2": a2,
                }
                data[amplitude].append(d)
                data_dict[amplitude][time] = d

    return data, data_dict
