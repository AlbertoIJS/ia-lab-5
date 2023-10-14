/*
Ávila Juárez Alexis Aramis
Jurado Santos Alberto Isaac
Gutiérrez Espinosa Jordan Gabriel
Pérez Ortiz Saúl
Ramirez Juárez Arturo Yamil
*/

import fs from "fs";
import { parse } from "csv-parse";

const trainMap = new Map(),
  testMap = new Map();

fs.createReadStream("train.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", (row) => fillMap(trainMap, row))
  .on("end", () => {
    const petallength1 = getAverage(
        trainMap.get("Iris-setosa"),
        trainMap.get("Iris-versicolor"),
        "petallength",
      ),
      petallength2 = getAverage(
        trainMap.get("Iris-versicolor"),
        trainMap.get("Iris-virginica"),
        "petallength",
      ),
      petalwidth1 = getAverage(
        trainMap.get("Iris-setosa"),
        trainMap.get("Iris-versicolor"),
        "petalwidth",
      ),
      petalwidth2 = getAverage(
        trainMap.get("Iris-versicolor"),
        trainMap.get("Iris-virginica"),
        "petalwidth",
      );

    fs.createReadStream("test.csv")
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", (row) => fillMap(testMap, row))
      .on("end", () => {
        const totalCount = new Map();

        for (const key of testMap.keys())
          for (const [currentLength, currentWidth] of testMap.get(key)) {
            let currentCount = totalCount.get(key) ?? [0, 0];

            if ("Iris-setosa") {
              if (currentLength < petallength1) currentCount[0]++;
              if (currentWidth < petalwidth1) currentCount[1]++;
            }

            if ("Iris-versicolor") {
              if (currentLength >= petallength1 && currentLength < petallength2)
                currentCount[0]++;
              if (currentWidth >= petalwidth1 && currentWidth < petalwidth2)
                currentCount[1]++;
            }
            if ("Iris-virginica") {
              if (currentLength >= petallength2) currentCount[0]++;
              if (currentWidth >= petalwidth2) currentCount[1]++;
            }

            totalCount.set(key, currentCount);
          }

        console.log(Array.from(totalCount));
      });
  });

function fillMap(map, row) {
  let arr = map.get(row[2]) ?? [];
  const val = row.slice(0, 2);

  map.set(row[2], [...arr, val]);
}

function getAverage(nums1, nums2, columnName) {
  const columns = {
    petallength: 0,
    petalwidth: 1,
  };

  const col = columns[columnName];

  const arr1 = nums1.map((s) => Number(s[col]));
  const arr2 = nums2.map((s) => Number(s[col]));

  const min = Math.max(...arr1);
  const max = Math.min(...arr2);

  return (min + max) / 2;
}
