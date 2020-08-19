'use strict';

const dbName = 'ShahzodData';
const keyN = 'settlementsTable';
const site = 'http://some_internal_page';
const pageSize = 18000;

if (document.location.href === "http://abcdef/#/") {

	window.setTimeout(banklarNomi, 6000);

    var banklarArray = [
			"09001", "Марказий банк", "001",
			"09002", "Ўзмиллийбанк", "002",
			"09003", "Ўзсаноатқурилишбанк", "003",
			"09004", "Агробанк", "004",
			"09005", "Микрокредитбанк", "005",
			"09006", "Халқ банк", "006",
			"09008", "Савдогар банк", "008",
			"09009", "Қишлоқ қурилиш банк", "009",
			"09011", "Туронбанк", "011",
			"09012", "Ҳамкорбанк", "012",
			"09013", "Асака банк", "013",
			"09014", "Ипак Йўли банк", "014",
			"09020", "Ziraat Bank Uzbekistan", "020",
			"09030", "Трастбанк", "030",
			"09031", "Алоқабанк", "031",
			"09033", "Ипотека-банк", "033",
			"09034", "КДБ Банк Ўзбекистон", "034",
			"09038", "Туркистон банк", "038",
			"00950", "Эрон Содерот банк", "043",
			"09048", "Универсал банк", "048",
			"09049", "Капиталбанк", "049",
			"00980", "Ravnaq-bank", "050",
			"09051", "Давр-банк", "051",
			"09053", "InFinBank", "053",
			"09055", "Asia Alliance Bank", "055",
			"01066", "Hi-Tech Bank", "056",
			"09057", "Ориент Финанс банк", "057",
			"01142", "Мадад Инвест Банк", "058",
			"01150", "Ўзагроэкспортбанк", "059",
			"01172", "Пойтахт банк", "060",
            		"01176", "Tenge bank", "061",
			"01180", "TBC bank", "062"
    ];

	function banklarNomi() {
        
        var ChartRemainder, tableBody, tableRows, bankPozitsiya;
        var tulovMarkazi, LongRefresh, tableRowsArr, bankniTopish;
        var downloadBut, personalAccount, debitNode, creditNode;
        var importDannix;
		
        try {
            
            var timerValue = document.querySelector('#timerBranchRemainder span').innerText;
            var timerSeconds = timerValue.substring(0, 2) * 60 + parseInt(timerValue.substring(3,));
            var refreshTime = timerSeconds * 1000 + 1000;

	    window.setTimeout(banklarNomi, refreshTime);

            //Kerakli jadvalni tanlash
            ChartRemainder = document.getElementById('contentChartRemainder');

            //"Дата овердрафта"ни ўзгартириш

            importDannix = ChartRemainder.querySelector('thead tr th:nth-child(7)');
            importDannix.innerHTML = "Импорт данных"
            importDannix.classList.add('forNewButton');
            importDannix.onclick = function() {
                var joriySana, myTab, myArr, fileName;
                joriySana = document.querySelector('#contentChartRemainder input[ng-model="remainder.query.date"]').value;
                myTab = document.querySelector('#contentChartRemainder table tbody');
                myArr = getTableDataRemainders(myTab);
                fileName = 'Remainders_' + joriySana + '.csv';
                exportToCsv(fileName, myArr);
            };


            tableRows = ChartRemainder.querySelectorAll('tbody tr');		
            tableRowsArr = Array.from(tableRows);	

            //Excelga import tugmachasini yaratish		
            downloadBut = document.createElement('label');		
            downloadBut.classList.add('changeBg');

            //Qo'shimchalarni qo'shish
            if (tableRows[0].getElementsByTagName("td")[0].innerHTML.length < 6) {		 //Oldin hech narsa qo'shilmagan bo'lsa

                tableRowsArr.forEach(function(tableRow, index, arr) {

                    tulovMarkazi = tableRow.getElementsByTagName("td")[0];
                    var bankPozitsiya = banklarArray.indexOf(tulovMarkazi.innerHTML);        			//to'lov markazining banklarArraydagi pozitsiyasini topish
                    if (bankPozitsiya !== -1) {															//bankning nomi mavjud bo'lsagina uni qo'shish
                        bankniTopish = banklarArray[bankPozitsiya + 1];
                        tulovMarkazi.innerHTML += " - " + bankniTopish;									//yuqoridagi orqali tegishli bankni topish va qo'shish
                        personalAccount = tableRows[index].getElementsByTagName("td")[6];				
                        debitNode = downloadBut.cloneNode(true);							//Debet va Kredit oborot uchun alohida tugmachalar qo'shish
                        creditNode = downloadBut.cloneNode(true);				
                        debitNode.innerHTML = 'Дебет';				
                        creditNode.innerHTML = 'Кредит';				
                        personalAccount.appendChild(debitNode);							    //Import tugmachasini qo'shish				
                        personalAccount.appendChild(creditNode);
                        var bankNum = banklarArray[bankPozitsiya + 2];
                        debitNode.addEventListener('click', function() {					
                            tableImport(bankNum, 0);											//Mos event listener qo'shish
                        });
                        creditNode.addEventListener('click', function() {					
                            tableImport(bankNum, 1);																
                        });
                        localStorage.setItem('iteration', 1)
                    }
                    tableRow.classList.add('changeRows');								//Qatorlarning ustidan o'tganda fonni o'zgartirish				
                });			
            }

            //2 minutlik yangilash tugmachasi bosilganda funksiyani chaqirish	
            LongRefresh = ChartRemainder.getElementsByClassName('btn-primary')[2];
            LongRefresh.onclick = function () { 
//				banklarNomi();            
                 onTimerClick(LongRefresh); 
            };		
        }
        
        catch(err) {								//yuklash sekin bo'lsa, keyinroq chaqirish
            window.setTimeout(banklarNomi, 1000);
        }
	}
    
	function onTimerClick(refreshElem) {
        if (refreshElem.disabled) {
            setTimeout(onTimerClick.bind(null, refreshElem), 500);
        } else {
            window.setTimeout(banklarNomi, 500);
        }
	}
}


//****************Import tugmasi bosilganda****************
function tableImport(rowNum, i) {
    
    var date, branchName, branchNum, pageNum;
	
    date = document.querySelector('#contentChartRemainder input[ng-model="remainder.query.date"]').value; //joriy sana
    branchName = i === 0 ? 'a' : 'b';
    branchNum = rowNum;
    pageNum = 1;
    
	//***********Progress bar uchun***********
	
	var timerRow, progress, myProgress, percentLabel;
	
	timerRow = document.querySelector('#contentChartRemainder div.col-sm-6.no-padding span.input-group-btn');
    progress = document.createElement('div');			//orqa fon
    progress.id = 'Progress_Status';
    myProgress = document.createElement('div');			//harakatlanuvchi fon
    myProgress.id = 'myProgressBar';
    percentLabel = document.createElement('span');		//bajarilganlik darajasini ko'rsatish
	percentLabel.id = 'percentLabel';
	percentLabel.innerHTML = 'Yuklanmoqda...';
    percentLabel.style.marginLeft = '12%';
    progress.appendChild(percentLabel);
    progress.appendChild(myProgress);
	timerRow.parentNode.appendChild(progress);			//web-page'ga biriktiramiz
	
	//*****************************************
	
    localStorage.setItem('date', date);
    localStorage.setItem('branchName', branchName);
    localStorage.setItem('branchNum', branchNum);
    postData(site, date, branchName, branchNum, pageNum, pageSize);

}	


//****************Serverga XMLHttpRequest yuboramiz****************
function postData(url, sana, filialTuri, filialRaqami, varaq, varaqHajmi) {
    
    var first;
    var xhr = new XMLHttpRequest();   
    var data = `date=${sana}&branch${filialTuri}=${filialRaqami}&error=2&pageNumber=${varaq}&pageSize=${varaqHajmi}`;

    xhr.open('POST', url + '?' + data, true);

    xhr.onload = function() {
        if (this.status == 200) {
			
			var javoblarArr, max, totalArr;

            javoblarArr = JSON.parse(this.responseText).content;
			max = Math.ceil(javoblarArr[0].CNTALL / pageSize);				//jami to'lovlar soni
            totalArr = getSettlementsArr(javoblarArr);						//javobning kerakli qismini olib olamiz
			
            if (varaq == 1) {
                first = true;
            }
            
            localStorage.setItem('tempArr', JSON.stringify(totalArr));
            localStorage.setItem('iteration', ++varaq);
			localStorage.setItem('max', max);
			
            if (!first) {
                getDataArr(dbName, keyN);
            } else {
                heartFunc([]);
            }
        }
    }

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");

    xhr.onerror = function() {
        alert("Error occured");
    }

    xhr.send(data);
}

//***************'Database'lar bilan ma'lumot almashamiz****************

function heartFunc(totalArr) {
    
    var date, branchName, branchNum, pageNum;
    var paymentsList, tempArr;
    
    tempArr = [];
    tempArr = JSON.parse(localStorage.getItem('tempArr'));
    totalArr = totalArr.concat(tempArr);                //olingan massivni oldingi ma'lumotlarga qo'shib yuborish
    creatAndAppend(totalArr, dbName, keyN);             //hosil bo'lgan massivni indexedDBga saqlash
    
    date = localStorage.getItem('date');
    branchName = localStorage.getItem('branchName');
    branchNum = localStorage.getItem('branchNum');
    pageNum = localStorage.getItem('iteration');
	
	update(localStorage.getItem('max'));


    if (tempArr.length === pageSize) {    				 //massivning oxirgi elementi jami to'lovlar soniga tengmi?

        postData(site, date, branchName, branchNum, pageNum, pageSize);

    } else {                                                        //oxirgi list b-sa, ishni yakunlash jarayoni
        
		var tipOborot, csvFileName;
		
		//CSV fayl nomiga qo'shish uchun to'lov markazini aniqlab olamiz
		
        tipOborot = branchName === 'a' ? 'Dr' : 'Cr';
		csvFileName = 'LiquidityData_' + branchNum + '_for_' + date + '_' + tipOborot + '.csv';
        
        exportToCsv(csvFileName, totalArr);
        
        removeData(dbName, keyN);                   //xotirani ortiqcha egallab turmasligi uchun 'Databese'lardan o'chirib tashlaymiz
        localStorage.removeItem('date');
        localStorage.removeItem('branchName');
        localStorage.removeItem('branchNum');
        localStorage.removeItem('iteration');
        localStorage.removeItem('tempArr');
        localStorage.removeItem('max');

    }
		
}

//****************Progress barni yangilash***************
function update(max) {
    var width, element, progress, percentLabel;
    var myProgress, widthIter, elemPercentLabel;
    
    widthIter = 100 / max;
    element = document.getElementById("myProgressBar");
	elemPercentLabel = document.getElementById("percentLabel");
	
    width = element.style.width;
    width = (width.indexOf('%') !== -1 ? width.replace('%', '') : width) * 1;
    width += widthIter;  
    
    var foiz = Math.round(width * 1);
    elemPercentLabel.innerHTML = foiz  + '%';
	elemPercentLabel.style.marginLeft = foiz !== 100 ? '40%' : '36%';
    element.style.width = width + '%';  
    
    if (foiz >= 100) {
		setTimeout(function() {
            var elementParent = document.getElementById("Progress_Status");
			elementParent.parentNode.removeChild(elementParent);
		}, 100);
    } 
} 

//***************Olingan massivni indexedDBga saqlash************
function creatAndAppend(dataArr, databaseName, keyName) {
  var dataStructured, request;
  dataStructured = [{myKey: keyName, myArr: dataArr}];
  request = indexedDB.open(databaseName, 1);

  request.onupgradeneeded = function(event) {      			//database yangidan yaratilsa yoki versiyasi o'zgarsa
    var db, objectStore;
    db = event.target.result;  
    objectStore = db.createObjectStore("data1", {keyPath: "myKey"});
    objectStore.add(dataStructured[0]);
  }
  
  request.onsuccess = function(event) {         			//muvaffaqiyatli aloqa o'rnatilsa
    var db, objectStore, transaction;
    db = event.target.result;
    transaction = db.transaction(["data1"], "readwrite");  
    objectStore = transaction.objectStore("data1");
    var objectStoreRequest = objectStore.put(dataStructured[0]);    //oldingi ma'lumot ustidan yozish (vs .add())
  }

}

//***********IndexedDBdagi ma'lumotni olish**********************
function getDataArr(databaseName, keyName) {
  var request = indexedDB.open(databaseName, 1);
  request.addEventListener('success', nested);
}

function nested(event) {
    var db, transaction, objectStore;
	db = event.target.result;
	transaction = db.transaction(["data1"]);
	objectStore = transaction.objectStore("data1");
	var myRequest = objectStore.get(keyN);
	myRequest.addEventListener('success', nested2);
}

function nested2(event) {
  var gotArray = event.target.result.myArr;
  heartFunc(gotArray); 							//ishni olingan massiv bilan davom etish
}
		

//***************************************************************
function removeData(databaseName, keyName){
	var request = indexedDB.open(databaseName, 1);
	request.onsuccess = function(event) {
		var db = event.target.result;
		var request = db.transaction(["data1"], "readwrite")
						.objectStore("data1")
						.delete(keyName);
		request.onsuccess = function(event) {
//		  console.log('Deleted!');
		};
	};
}

//***************************************************************

function getTableData(table) {
    var data = [];
    table.querySelectorAll('tr').forEach(function (r, rowIndex) {
        var cols = [];
        r.querySelectorAll('td').forEach(function (c, colIndex) {
//	    if (colIndex > 7) continue;
            cols.push(c.textContent);
        });
        data.push(cols);
    });
    return data;
}

function getTableDataSpecial(table) {
    var data, cols, rows, i;
    data = [];
    table.querySelectorAll('tr').forEach(function (r, rowIndex) {
        cols = [];
		rows = r.querySelectorAll('td');
		for (i = 0; i < 7; i++) {
			cols.push(rows[i].textContent);
		}
		data.push(cols);
    });
    return data;
}

function getTableDataRemainders(table) {
    var data, cols, rows, i;
    data = [];
    table.querySelectorAll('tr').forEach(function (r, rowIndex) {
        if (rowIndex > 0) {
            cols = [];
            rows = r.querySelectorAll('td');
            for (i = 0; i < 6; i++) {
                cols.push(replaceNonBreaking(rows[i].textContent.trim()));
            }
            data.push(cols);
        }
    });
    return data;
    
    function replaceNonBreaking(textBeingReplaced) {
        while (textBeingReplaced.indexOf('\u00A0') !== -1) {
            textBeingReplaced = textBeingReplaced.replace('\u00A0', '')
        } 
        return textBeingReplaced;
    }
}

//***************************************************************
function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
//***************************************************************
function getSettlementsArr(responseContents) {
    var TempArr;
    var TotalArr = [];
    responseContents.forEach(function(responseContent, index) {
        TempArr = [];
        TempArr[0] = responseContent.RN;
        TempArr[1] = responseContent.BANK_A;
        TempArr[2] = responseContent.ACCOUNT_A;
        TempArr[3] = responseContent.BANK_B;
        TempArr[4] = responseContent.ACCOUNT_B;        
        TempArr[5] = responseContent.SUMMA;
        TotalArr.push(TempArr);
    });
    return TotalArr;
}

