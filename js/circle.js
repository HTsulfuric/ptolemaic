onload = function () {
  draw();
}


function draw() {

  // 1画面目: 地動説
  const helio_cvs = document.getElementById('helio');
  const helio_context = helio_cvs.getContext('2d');

  // 2画面目: 天動説
  const ptole_cvs = document.getElementById('ptole');
  const ptole_context = ptole_cvs.getContext('2d');

  // 円運動の中心座標。
  // 今回はcanvasの真ん中を中心に移動する。

  const helio_center = {
    x: helio_cvs.width / 2,
    y: helio_cvs.height / 2
  };

  const ptole_center = {
    x: ptole_cvs.width / 2,
    y: ptole_cvs.height / 2
  };

  // 表示する円のサイズ。
  const circleSize = 10;

  // 変化させていくパラメータ。
  // angleRadを増加させていき、
  // それに伴いxとyが変化していくようにする。
  let orb1 = {
    x: 0,
    y: 0,
    rad: 100,
    v: 3
  };
  let orb2 = {
    x: 0,
    y: 0,
    rad: 150,
    v: 5
  };
  let orb3 = {
    x: 0,
    y: 0
  }


  let angleRad = 0;

  let orb3Trajectory = [];

  // orb3の幅を求める。 正であることを確認
  let orb3width = orb1.rad + orb2.rad;

  let shortSide = Math.max(ptole_cvs.width, ptole_cvs.height);

  const rad1Slider = document.getElementById('rad1Slider');
  const rad1Value = document.getElementById('rad1Value');
  rad1Slider.addEventListener('input', function () {
    orb1.rad = parseInt(rad1Slider.value);
    rad1Value.textContent = orb1.rad;
    angleRad = 0;
    orb3Trajectory = [];
  });

  const rad2Slider = document.getElementById('rad2Slider');
  const rad2Value = document.getElementById('rad2Value');
  rad2Slider.addEventListener('input', function () {
    orb2.rad = parseInt(rad2Slider.value);
    rad2Value.textContent = orb2.rad;
    angleRad = 0;
    orb3Trajectory = [];
  });

  const v1Slider = document.getElementById('v1Slider');
  const v1Value = document.getElementById('v1Value');
  v1Slider.addEventListener('input', function () {
    orb1.v = parseInt(v1Slider.value);
    v1Value.textContent = orb1.v;
    angleRad = 0;
    orb3Trajectory = [];
  });

  const v2Slider = document.getElementById('v2Slider');
  const v2Value = document.getElementById('v2Value');
  v2Slider.addEventListener('input', function () {
    orb2.v = parseInt(v2Slider.value);
    v2Value.textContent = orb2.v;
    angleRad = 0;
    orb3Trajectory = [];
  });


  // メインループ
  function loop() {
    // 描画内容を消去する。
    helio_context.clearRect(0, 0, helio_cvs.width, helio_cvs.height);
    ptole_context.clearRect(0, 0, ptole_cvs.width, ptole_cvs.height);

    // longSide, orb3widthを更新する。
    shortSide = Math.min(ptole_cvs.width, ptole_cvs.height) / 2;
    orb3width = orb1.rad + orb2.rad + 10;

    // angleRadを1度ずつ変化させていく。
    // 1度はMath.PI/180ラジアン。
    angleRad += 1 * Math.PI / 180;

    // ここで座標を変化させていく。
    orb1.x = orb1.rad * Math.cos(orb1.v * angleRad) + helio_center.x;
    orb1.y = orb1.rad * Math.sin(orb1.v * angleRad) + helio_center.y;
    orb2.x = orb2.rad * Math.cos(orb2.v * angleRad) + helio_center.x;
    orb2.y = orb2.rad * Math.sin(orb2.v * angleRad) + helio_center.y;

    orb3.x = (orb2.x - orb1.x) * (shortSide / orb3width) + ptole_center.x;
    orb3.y = (orb2.y - orb1.y) * (shortSide / orb3width) + ptole_center.y;

    if (orb3Trajectory.length > 360) {
      orb3Trajectory.shift();
    }
    orb3Trajectory.push({ x: orb3.x, y: orb3.y });

    // 求めた座標に円を描画する。
    helio_context.beginPath();
    helio_context.arc(orb1.x, orb1.y, circleSize, 0, Math.PI * 2);
    helio_context.fill();

    helio_context.beginPath();
    helio_context.arc(orb2.x, orb2.y, circleSize, 0, Math.PI * 2);
    helio_context.fill();

    ptole_context.beginPath();
    ptole_context.arc(orb3.x, orb3.y, circleSize, 0, Math.PI * 2);
    ptole_context.fill();

    // 円の軌道を描画する。
    helio_context.beginPath();
    helio_context.arc(helio_center.x, helio_center.y, orb1.rad, 0, Math.PI * 2);
    helio_context.stroke();

    helio_context.beginPath();
    helio_context.arc(helio_center.x, helio_center.y, orb2.rad, 0, Math.PI * 2);
    helio_context.stroke();

    //canvasの外枠を描画する。
    helio_context.strokeRect(0, 0, helio_cvs.width, helio_cvs.height);
    ptole_context.strokeRect(0, 0, ptole_cvs.width, ptole_cvs.height);

    //orb3の軌道を描画する。
    ptole_context.beginPath();
    for (let i = 0; i < orb3Trajectory.length - 1; i++) {
      ptole_context.moveTo(orb3Trajectory[i].x, orb3Trajectory[i].y);
      ptole_context.lineTo(orb3Trajectory[i + 1].x, orb3Trajectory[i + 1].y);
    }
    ptole_context.strokeStyle = 'blue';
    ptole_context.stroke();

    ptole_context.strokeStyle = 'black';


    window.requestAnimationFrame(loop);
  }

  window.requestAnimationFrame(loop);

}
