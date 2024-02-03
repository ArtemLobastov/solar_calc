import { useState } from 'react';
import { panelsSize } from './model';
function App() {
  const [numPanels, setNumPanels] = useState(6);
  const [brandPanel, setBrandPanel] = useState('recom700');
  const [panelsRowsNum, setPanelsRowsNum] = useState(2);
  const [panelsColumnsNum, setPanelsColumnsNum] = useState(3);
  const [elevationFront, setElevationFront] = useState(0);
  const [elevationBack, setElevationBack] = useState(100);
  const [fixing, setFixing] = useState('roof');
  //state electrical
  const [phase, setPhase] = useState('singlePhase');
  const [inverter, setInverter] = useState('Huawei 3.68 KTL');
  const [cablingLenght, setCablingLength] = useState('35');
  const [bats, setBats] = useState('no');

  const panelWidth = +panelsSize.filter((e) => e.name === brandPanel)[0].width;
  const panelHeight = +panelsSize.filter((e) => e.name === brandPanel)[0]
    .height;

  //FRAME calculation
  const railLengthCm = Math.round(
    (15 + panelsColumnsNum * panelWidth + (panelsColumnsNum + 1) * 2) *
      2 *
      panelsRowsNum +
      400
  );
  const railNum = Math.ceil(railLengthCm / 600);

  function legAmountCalc(numOfpanelsInRow) {
    if (numOfpanelsInRow === 0) return;
    if (numOfpanelsInRow > 0 && numOfpanelsInRow <= 2) return 2;
    if (
      (numOfpanelsInRow * 132 - 60) / (numOfpanelsInRow - 1) <= 180 &&
      (numOfpanelsInRow * 132 - 60) / (numOfpanelsInRow - 1) >= 150
    )
      return numOfpanelsInRow;
    if ((numOfpanelsInRow * 132 - 60) / (numOfpanelsInRow - 1) <= 150)
      return numOfpanelsInRow - 1;
  }
  const legsAmount = legAmountCalc(panelsColumnsNum);
  const legLenght = panelHeight * panelsRowsNum - 60;

  //Single leg angle calculation
  function angleForLegCalc(
    legsAmount,
    legLenght,
    elevationBack,
    elevationFront
  ) {
    const midllePartsNum = panelsRowsNum + 1;

    const lowestMiddle =
      elevationFront === 0
        ? elevationBack / (midllePartsNum + 1)
        : (elevationBack - elevationFront) / (midllePartsNum + 1);
    function middleCalcSum(lowest, middleNum) {
      let result = 0;
      let currentNumber = lowest;

      for (let i = 0; i < middleNum; i++) {
        result += currentNumber;
        currentNumber += lowest;
      }
      return result;
    }

    const middleSum = middleCalcSum(lowestMiddle, midllePartsNum);
    if (elevationFront === 0)
      return Math.ceil(
        (legsAmount * (legLenght * 2 + elevationBack + middleSum) + 400) / 600
      );
    if (elevationFront > 0)
      return Math.ceil(
        ((legLenght * 2 +
          elevationFront +
          elevationBack +
          middleSum +
          elevationFront * midllePartsNum +
          60) *
          legsAmount +
          800) /
          600
      );
  }

  const angleSum = angleForLegCalc(
    legsAmount,
    legLenght,
    elevationBack,
    elevationFront
  );

  const materialListFrame = [
    { rails: railNum },
    { angles: angleSum },
    { bolts: numPanels <= 6 ? 100 : 200 },
    { nuts: numPanels <= 6 ? 100 : 200 },
    { fishers: numPanels <= 6 ? 50 : 100 },
    { hexBolts10mm: panelsRowsNum * 4 + 7 },
    { hexBolts20mm: (panelsColumnsNum - 1) * 2 * panelsRowsNum + 5 },
    {
      squareNuts:
        panelsRowsNum * 4 +
        7 +
        ((panelsColumnsNum - 1) * 2 * panelsRowsNum + 5),
    },
    { panelMiddleClamp: (panelsColumnsNum - 1) * 2 * panelsRowsNum },
    { panelEndClamp: panelsRowsNum * 4 },
    fixing === 'roof' && { silicone: numPanels < 13 ? 1 : 2 },
  ];
  const materialListElectrical = [
    phase === 'singlePhase' && {
      powerCable: `${cablingLenght === '35' ? 'roll of 3g4' : 'roll of 3g6'}`,
    },
    phase === 'threePhase' && { powerCable: `roll of 5g4` },
    { cableClips: cablingLenght === '35' ? '1 pack' : '2 packs' },
    { cableTies: numPanels < 10 ? '1 pack' : '2 pack' },
    { solarCable: numPanels < 7 ? '20m' : '50m' },
    { mcb: phase },
    { rcd: phase },
    { electricBox: `${phase === 'singlePhase' ? '4 pole' : '8 pole'}` },
    { inverter: inverter },
    { isolator: 1 },
    { earthCable: '10m' },
    { earthClamp: 5 },
    bats !== 'no' && {
      batts:
        (bats === '10kwh' && 2) ||
        (bats === '15kwh' && 3) ||
        (bats === '5kwh' && 1),
    },
    bats !== 'no' && { batController: 1 },
    bats !== 'no' && { utpCable: 'roll' },
    bats !== 'no' && { powerMeter: 1 },
  ];
  return (
    <div className="calculator">
      <div className="leftSide">
        <div className="inputContainer">
          <SystemDetails
            panelWidth={panelWidth}
            panelHeight={panelHeight}
            numPanels={numPanels}
            setNumPanels={setNumPanels}
            brandPanel={brandPanel}
            setBrandPanel={setBrandPanel}
            panelsRowsNum={panelsRowsNum}
            setPanelsRowsNum={setPanelsRowsNum}
            panelsColumnsNum={panelsColumnsNum}
            setPanelsColumnsNum={setPanelsColumnsNum}
            elevationFront={elevationFront}
            setElevationFront={setElevationFront}
            elevationBack={elevationBack}
            setElevationBack={setElevationBack}
            setFixing={setFixing}
            phase={phase}
            setPhase={setPhase}
            inverter={inverter}
            setInverter={setInverter}
            cablingLenght={cablingLenght}
            setCablingLength={setCablingLength}
            bats={bats}
            setBats={setBats}
          />
        </div>
      </div>

      <div className="checkListContainer">
        <MaterialsCheckList
          materialListElectrical={materialListElectrical}
          materialListFrame={materialListFrame}
        />
      </div>
    </div>
  );
}
function SystemDetails({
  numPanels,
  setNumPanels,
  brandPanel,
  setBrandPanel,
  panelsRowsNum,
  setPanelsRowsNum,
  panelsColumnsNum,
  setPanelsColumnsNum,
  elevationFront,
  setElevationFront,
  elevationBack,
  setElevationBack,
  fixing,
  setFixing,
  phase,
  setPhase,
  inverter,
  setInverter,
  cablingLenght,
  setCablingLength,
  bats,
  setBats,
}) {
  return (
    <div className="systemDetails">
      <h2>System details</h2>
      <h3>Panels</h3>
      <label>Quantity of panels ( {numPanels} )</label>
      <input
        value={numPanels}
        type="range"
        name=""
        id=""
        min="0"
        max="20"
        onChange={(e) => setNumPanels(+e.target.value)}
      />
      <label>Panels Brand </label>
      <select
        className="inputField"
        name=""
        id=""
        value={brandPanel}
        onChange={(e) => setBrandPanel(e.target.value)}
      >
        <option value="recom700">Recom 700</option>
        <option value="swissSolar545">Swiss Solar 545</option>
      </select>
      <label>Panel Rows</label>
      <input
        className="inputField"
        type="text"
        value={panelsRowsNum}
        onChange={(e) =>
          e.target.value >= 0
            ? setPanelsRowsNum((panelsRowsNum) => +e.target.value)
            : panelsRowsNum
        }
      />
      <label>Panel columns</label>
      <input
        className="inputField"
        type="text"
        value={panelsColumnsNum}
        onChange={(e) =>
          e.target.value >= 0
            ? setPanelsColumnsNum(+e.target.value)
            : panelsColumnsNum
        }
      />
      <h3>Frame</h3>
      <label>Elevation front cm</label>
      <input
        className="inputField"
        type="text"
        value={elevationFront}
        onChange={(e) =>
          e.target.value >= 0
            ? setElevationFront(+e.target.value)
            : elevationFront
        }
      />
      <label>Elevation Back cm</label>
      <input
        className="inputField"
        type="text"
        value={elevationBack}
        onChange={(e) =>
          e.target.value >= 0
            ? setElevationBack(+e.target.value)
            : elevationBack
        }
      />
      Type of fixing
      <select
        className="inputField"
        name=""
        id=""
        value={fixing}
        onChange={(e) => setFixing(e.target.value)}
      >
        <option value="roof">To the roof</option>
        <option value="bricks">On bricks</option>
      </select>
      <h3>Electrical</h3>
      <label>Phase</label>
      <select
        className="inputField"
        value={phase}
        onChange={(e) => setPhase(e.target.value)}
      >
        <option value="singlePhase">1 phase</option>
        <option value="threePhase">3 phase</option>
      </select>
      <label>Inverter model</label>
      {phase === 'singlePhase' ? (
        <select
          className="inputField"
          value={inverter}
          onChange={(e) => setInverter(e.target.value)}
        >
          <option value="Huawei 3.68 KTL">Huawei 3.68 KTL</option>
          <option value="Huawei 2 KTL">Huawei 2 KTL</option>
        </select>
      ) : (
        <select
          className="inputField"
          value={inverter}
          onChange={(e) => setInverter(e.target.value)}
        >
          <option value="huawei 4 KTL">Huawei 4 KTL</option>
          <option value="Huawei 6 KTL">Huawei 6 KTL</option>
          <option value="Huawei 10 KTL">Huawei 10 KTL</option>
        </select>
      )}
      <label>Cabling m</label>
      <select
        className="inputField"
        value={cablingLenght}
        onChange={(e) => setCablingLength(e.target.value)}
      >
        <option value="35">35m or less</option>
        <option value="over35">over 35m</option>
      </select>
      <label>Battaries</label>
      <select
        className="inputField"
        value={bats}
        onChange={(e) => setBats(e.target.value)}
      >
        <option value="no">no</option>
        <option value="5kwh">5kwh</option>
        <option value="10kwh">10kwh</option>
        <option value="15kwh">15kwh</option>
      </select>
    </div>
  );
}

function MaterialsCheckList({ materialListFrame, materialListElectrical }) {
  return (
    <div className="">
      <h2>Materials Checklist</h2>
      <h3>Frame</h3>
      <ul className="checkList">
        {materialListFrame.map(
          (material, i) =>
            material && (
              <li key={Object.keys(material)}>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    (e.target.closest('li').style.textDecoration = `${
                      e.target.checked ? 'line-through' : 'none'
                    }`)
                  }
                />
                {Object.keys(material)}: {Object.values(material)}
              </li>
            )
        )}
      </ul>
      <h3>Electrical</h3>
      <ul className="checkList">
        {materialListElectrical.map(
          (material, i) =>
            material && (
              <li key={Object.keys(material)}>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    (e.target.closest('li').style.textDecoration = `${
                      e.target.checked ? 'line-through' : 'none'
                    }`)
                  }
                />
                {Object.keys(material)}: {Object.values(material)}
              </li>
            )
        )}
      </ul>
      <div className="btnContainer">
        <button className="button">share list</button>
        <button className="button">structure details</button>
        <button className="button">simple connection FAQ</button>
        <button className="button">bats assembly FAQ</button>
        <button className="button">bats connection FAQ</button>
        <button className="button">offgrid box FAQ</button>
      </div>
    </div>
  );
}
export default App;
