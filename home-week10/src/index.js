async function getRandomDog() {
    try {
        const response = await fetch("https://random.dog/woof.json");
        const data = await response.json();

        const container = document.getElementById("mediaContainer");
        container.innerHTML = ""; // 기존 콘텐츠 초기화

        // 이미지 파일 형식만 허용 (jpg, jpeg, png)
        if (data.url.match(/\.(jpg|jpeg|png)$/i)) {
            const img = document.createElement("img");
            img.src = data.url;
            img.alt = "랜덤 강아지 사진";
            img.width = 400;
            container.appendChild(img);
        } else {
            getRandomDog(); //이미지 파일 형식이 아닐 경우 함수 재호출
        }
    } catch (error) {
        console.error("Error fetching dog media:", error);
    }
}

function saveDog() {
    const dogName = document.getElementById("dogName").value.trim();
    const mediaContainer = document.getElementById("mediaContainer").firstChild;

    if (!dogName || !mediaContainer || !mediaContainer.src) {
        alert("강아지 이름과 이미지를 확인하세요!");
        return;
    }

    const savedDogs = JSON.parse(localStorage.getItem("savedDogs")) || [];
    savedDogs.push({ name: dogName, url: mediaContainer.src });
    localStorage.setItem("savedDogs", JSON.stringify(savedDogs));

    document.getElementById("dogName").value = ""; // 입력 초기화
    alert("저장되었습니다!");
    displaySavedDogs();
}

function displaySavedDogs() {
    const savedDogs = JSON.parse(localStorage.getItem("savedDogs")) || [];
    const dogList = document.getElementById("dogList");

    dogList.innerHTML = ""; // 기존 목록 초기화

    savedDogs.forEach((dog, index) => {
        const listItem = document.createElement("li");

        const strong = document.createElement("strong");
        strong.textContent = dog.name;

        const img = document.createElement("img");
        img.src = dog.url;
        img.width = 200;
        img.alt = "Saved puppy images";

        const saveButton = document.createElement("button");
        saveButton.textContent = "사진 저장";
        saveButton.addEventListener("click", () => downloadDog(dog.name, dog.url));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "사진 삭제";
        deleteButton.addEventListener("click", () => deleteDog(index)); // 삭제 이벤트 추가

        listItem.appendChild(strong);
        listItem.appendChild(document.createElement("br"));
        listItem.appendChild(img);
        listItem.appendChild(document.createElement("br"));
        listItem.appendChild(saveButton);
        listItem.appendChild(deleteButton);

        dogList.appendChild(listItem);
    });
}

function deleteDog(index) {
    const savedDogs = JSON.parse(localStorage.getItem("savedDogs")) || [];
    savedDogs.splice(index, 1); // 특정 인덱스의 항목 삭제
    localStorage.setItem("savedDogs", JSON.stringify(savedDogs));
    displaySavedDogs(); // 업데이트된 목록 렌더링
}

function downloadDog(name, url) {
    fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${name}.jpg`; // 파일 이름은 강아지 이름으로 저장
            document.body.appendChild(link); // 링크를 DOM에 추가
            link.click(); // 클릭 이벤트 트리거
            document.body.removeChild(link); // 링크 삭제
            URL.revokeObjectURL(link.href); // 메모리 해제
        })
        .catch((error) => console.error("이미지 다운로드 오류:", error));
}

document.getElementById("getDog").addEventListener("click", getRandomDog);
document.getElementById("saveDog").addEventListener("click", saveDog);
document.addEventListener("DOMContentLoaded", displaySavedDogs);
