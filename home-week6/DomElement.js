// 모든 식물 요소에 drag 이벤트 리스너 추가
document.querySelectorAll('.plant').forEach(plant => {
    plant.addEventListener('dragstart', dragStart);
    plant.addEventListener('dblclick', bringToFront); // 더블 클릭 시 맨 앞으로 오게 설정
});

// 테라리움 드롭 영역
const terrarium = document.getElementById('terrarium');
terrarium.addEventListener('dragover', dragOver);
terrarium.addEventListener('drop', drop);

let zIndexCounter = 1;

function dragStart(e) {
    // 드래그한 요소의 ID 저장
    e.dataTransfer.setData('text/plain', e.target.id);
    console.log(`Dragging element: ${e.target.id}`);
}

function dragOver(e) {
    // 기본 동작 방지 (드롭 가능하도록)
    e.preventDefault();
    e.dataTransfer.dropEffect = "move"; // 드롭 효과 설정
}

function drop(e) {
    e.preventDefault();
    // 드래그한 요소의 ID 가져오기
    const plantId = e.dataTransfer.getData('text');
    const plant = document.getElementById(plantId);

    terrarium.appendChild(plant);

    const rect = terrarium.getBoundingClientRect();
    const dropX = e.clientX 
    const dropY = e.clientY 

    // 드롭할 위치를 마우스 위치에 맞추기 (이미지 크기 반만 보정)
    plant.style.position = 'absolute'
    plant.style.left = `${dropX - (plant.clientWidth / 2)}px`;
    plant.style.top = `${dropY - (plant.clientHeight / 2)}px`;
    
    console.log(`Dropped element: ${plantId} at (${dropX}, ${dropY})`);
}

function bringToFront(e) {
    zIndexCounter++;
    e.target.style.zIndex = zIndexCounter;
    console.log(`Element ${e.target.id} z-index: ${zIndexCounter}`);
}
