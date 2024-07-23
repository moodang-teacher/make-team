document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveDataBtn').addEventListener('click', saveData);
    document.getElementById('loadData').addEventListener('change', loadData);
    document.getElementById('addMemberBtn').addEventListener('click', addMember);
    document.getElementById('decreaseTeamSizeBtn').addEventListener('click', () => changeTeamSize(-1));
    document.getElementById('increaseTeamSizeBtn').addEventListener('click', () => changeTeamSize(1));
    document.getElementById('createTeamsBtn').addEventListener('click', createTeams);
});

let teamMembers = [];
let teamSize = 3;

function displayMembers() {
    const memberList = document.getElementById('memberList');
    memberList.innerHTML = ''; // 기존 요소를 지우고 새로 추가
    teamMembers.forEach((member, index) => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        memberCard.innerHTML = `
            <img src="${member.image}" alt="${member.name}">
            <p>${member.name}</p>
            <button onclick="removeMember(${index})">삭제</button>
        `;
        memberList.appendChild(memberCard);
    });
}

function validateMemberInput(name, profileImage) {
    if (!name || !profileImage) {
        alert('이름과 프로필 이미지를 모두 입력해주세요.');
        return false;
    }
    return true;
}

function addMember() {
    const name = document.getElementById('memberName').value;
    const profileImage = document.getElementById('profileImage').files[0];

    if (!validateMemberInput(name, profileImage)) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        teamMembers.push({ name: name, image: e.target.result });
        displayMembers();
        document.getElementById('memberName').value = '';
        document.getElementById('profileImage').value = '';
    }
    reader.readAsDataURL(profileImage);
}

function removeMember(index) {
    teamMembers.splice(index, 1);
    displayMembers();
}

function changeTeamSize(change) {
    teamSize = Math.max(2, teamSize + change);
    document.getElementById('teamSizeDisplay').textContent = teamSize;
}

function createTeams() {
    if (teamMembers.length < teamSize) {
        alert('팀원 수가 팀 크기보다 적습니다.');
        return;
    }

    const shuffled = [...teamMembers].sort(() => 0.5 - Math.random());
    const teams = [];

    for (let i = 0; i < shuffled.length; i += teamSize) {
        teams.push(shuffled.slice(i, i + teamSize));
    }

    displayTeams(teams);
}

function displayTeams(teams) {
    const teamsDiv = document.getElementById('teams');
    teamsDiv.innerHTML = ''; // 기존 요소를 지우고 새로 추가

    teams.forEach((team, index) => {
        const teamDiv = document.createElement('div');
        teamDiv.innerHTML = `<h3>팀 ${index + 1}</h3>`;
        team.forEach(member => {
            teamDiv.innerHTML += `
                <div class="member-card">
                    <img src="${member.image}" alt="${member.name}">
                    <p>${member.name}</p>
                </div>
            `;
        });
        teamsDiv.appendChild(teamDiv);
    });
}

function saveData() {
    const data = JSON.stringify(teamMembers);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'team_data.json';
    a.click();
}

function loadData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                teamMembers = JSON.parse(e.target.result);
                displayMembers();
            } catch (error) {
                alert('유효하지 않은 JSON 파일입니다.');
            }
        };
        reader.readAsText(file);
    }
}
