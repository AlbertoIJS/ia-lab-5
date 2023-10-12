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
        let totalPLength = 0,
          totalPWidth = 0;

        for (const [, val] of testMap) {
          let currentLength = val[0][0],
            currentWidth = [0][1];

          if (currentLength >= petallength1 && currentLength <= petallength2)
            totalPLength++;
          if (currentWidth >= petalwidth1 && currentWidth <= petalwidth2)
            totalPWidth++;
        }
        console.log("petallength clasificados correctamente: ", totalPLength);
        console.log("petalwidth clasificados correctamente: ", totalPWidth);
      });
  });

function fillMap(map, row) {
  let arr = map.get(row[2]);

  const val = row.slice(0, 2);
  if (arr === undefined) arr = [val];
  else arr.push(val);

  map.set(row[2], arr);
}

function getAverage(nums1, nums2, columnName) {
  const columns = {
    petallength: 0,
    petalwidth: 1,
  };

  const col = columns[columnName];

  const petallength = nums1.map((s) => Number(s[col]));
  const petalwidth = nums2.map((s) => Number(s[col]));

  const min = Math.min(...petallength);
  const max = Math.max(...petalwidth);

  return (min + max) / 2;
}
