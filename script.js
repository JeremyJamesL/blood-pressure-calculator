// Data structure

var dataController = (function() {

    var sys = [];
    var dys = [];

    return {
        addItem: function(valSystolic, valDiastolic) {
            sys.push(valSystolic);
            dys.push(valDiastolic);
        },

        sysLength: function() {
            return sys.length;
        },

        disLength: function() {
            return dys.length;
        },

        calcAvgs: function() {
            var sysSum, disSum, sysAvg, disAvg, arrTot;
            sysSum = 0;
            disSum = 0;
 
            // Sum together array amounts
            for(let i = 0; i < sys.length; i++) {
                sysSum += sys[i];
            }

            for(let i = 0; i < dys.length; i++) {
                disSum += dys[i]; 
            }

            // Divide array amounts
            sysAvg = parseInt(sysSum / sys.length);
            disAvg = parseInt(disSum / sys.length);
            arrTot = [sysAvg, disAvg];
            return arrTot;

        },

        clearData: function() {
            sys = [];
            dys = [];
        },

        testing: function() {
            console.log(sys);
            console.log(dys);
            console.log(dataController.calcAvgs());
        }

    }


})();


// Interface Controller

var interfaceController = (function() {

    var DOMStrings = {
        sysRead: '.sys-input',
        diasRead: '.dys-input',
        subBtn: '.submit',
        sysContainer: '.systolic-list',
        diasContainer: '.diastolic-list',
        systolicAvg: '.systolic-avg',
        diastolicAvg: '.diastolic-avg',
        clearAllBtn: '.clearall',
        calcResultsBtn: '.calcresults',
        modalClose: '.modal__close',
        theOpenModal: '.modal__display',
        resultsContainer: '.results',
        heartIcon: '.calculator__icon'
    };

    return {

        heartAnimation: function() {
            var heartIcon = document.querySelector(DOMStrings.heartIcon);
            heartIcon.classList.toggle('calculator__icon--running');
    
            heartIcon.onanimationend = () => {
                heartIcon.classList.remove('calculator__icon--running');
            }
        },

        getInputVals: function() {
            return {
                sysVal: parseInt(document.querySelector(DOMStrings.sysRead).value),
                diasVal: parseInt(document.querySelector(DOMStrings.diasRead).value)
            }
        },

        displayItems: function(valSystolic, valDiastolic) {

            // Get array lengths
            var arrlgth1, arrlgth2;

            arrlgth1 = dataController.sysLength();
            arrlgth2 = dataController.disLength();

            // Show results container on first submit
            if(arrlgth1 >= 1) {
                document.querySelector(DOMStrings.resultsContainer).style.display = "block";
            }

            // Create HTML string w/ placeholder text
            var shtml, dhtml, snewHtml, dnewHtml;

            shtml = '<li class="systolic-list__item readings-list__item" id="sys-%id%"><span class="readings-list__item-num">%sreadingnum%</span> <span class="readings-list__item-value">%value% mm/hg</span></li>';
            dhtml = '<li class="diastolic-list__item readings-list__item" id="sys-%id%"><span class="readings-list__item-num">%dreadingnum%</span> <span class="readings-list__item-value">%value% mm/hg</span></li>';

            // filter systolic html
            snewHtml = shtml.replace('%value%', valSystolic); 
            snewHtml = snewHtml.replace('%sreadingnum%', arrlgth1); 
            snewHtml = snewHtml.replace('%id%', arrlgth1); 

            // Filter diastolic html
            dnewHtml = dhtml.replace('%value%', valDiastolic); 
            dnewHtml = dnewHtml.replace('%dreadingnum%', arrlgth2); 
            dnewHtml = dnewHtml.replace('%id%', arrlgth2); 

            // Insert html into DOM
            document.querySelector(DOMStrings.sysContainer).insertAdjacentHTML('beforeend', snewHtml);
            document.querySelector(DOMStrings.diasContainer).insertAdjacentHTML('beforeend', dnewHtml);

        },

        displayAvg: function() {
            var arr, shtml, dhtml, snewhtml, dnewhtml;
            arr = dataController.calcAvgs();

            // Create HTML string w/ placeholder text
            shtml = '<div class="systolic-avg">%amount% mm/hg</div>';
            dhtml = '<div class="diastolic-avg">%amount% mm/hg</div>';

            // Filter HTML
            snewhtml = shtml.replace('%amount%', arr[0]);
            dnewhtml = dhtml.replace('%amount%', arr[1]);

            // Display new html
            document.querySelector(DOMStrings.systolicAvg).innerHTML =  snewhtml;
            document.querySelector(DOMStrings.diastolicAvg).innerHTML =  dnewhtml;

        },

        displayModal: function(result) {

            switch(result) {
                case 'normal':
                    document.querySelector('.modal--' + result).classList.add("modal__display");
                break;

                case 'elevated':
                    document.querySelector('.modal--' + result).classList.add("modal__display");
                break;

                case 'h1':
                    document.querySelector('.modal--' + result).classList.add("modal__display");
                break;

                case 'h2':
                    document.querySelector('.modal--' + result).classList.add("modal__display");
                break;

                default:
                    document.querySelector('.modal--' + result).classList.add("modal__display");
            }

        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll('.calculator__input');

            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();

        },

        clearAllEntries: function() {
            document.querySelector(DOMStrings.sysContainer).innerHTML = '';
            document.querySelector(DOMStrings.diasContainer).innerHTML = '';
            document.querySelector(DOMStrings.systolicAvg).innerHTML =  '';
            document.querySelector(DOMStrings.diastolicAvg).innerHTML =  '';
        },

        closeModal: function() {
            document.querySelector(DOMStrings.theOpenModal).classList.remove('modal__display');
        },

        getDOMStrings: function() {
            return DOMStrings;
        }
    };

})();


// Controller

var controller = (function(UICtrl, dataCtrl) {
    
    var setUpEventListeners =  function() {

        var DOM = UICtrl.getDOMStrings();

        // For adding items to data structure and UI
        document.querySelector(DOM.subBtn).addEventListener( "click", ctrlAddItem );

        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        // For Clearing all fields
        document.querySelector(DOM.clearAllBtn).addEventListener( "click", clearAll );

        // For calculating results
        document.querySelector(DOM.calcResultsBtn).addEventListener( "click", calcResults );

        // Closing modal boxes
        var closeBtns = document.querySelectorAll(DOM.modalClose);

        for(let i = 0; i < closeBtns.length; i++) {
            closeBtns[i].addEventListener("click", UICtrl.closeModal);
        };
    
    } 

    var ctrlAddItem = function() {

        var input;

        // 1. Get input field data
        input = UICtrl.getInputVals();

            if((input.sysVal > 0 && input.sysVal < 1000) && (input.diasVal > 0 && input.diasVal < 1000)) {

                // Run heart animation
                UICtrl.heartAnimation();

                // 2. Add input values to data structure
                dataCtrl.addItem(input.sysVal, input.diasVal);

                // 3. Display input values in respective fields
                UICtrl.displayItems(input.sysVal, input.diasVal);

                // 4. Display averages
                UICtrl.displayAvg();

                // 5. Clear input fields
                UICtrl.clearFields();
                    
            } else {
                alert('please enter both values. Values must be greater than 0 and less than 1000');
            }
   
    }

    var clearAll = function() {
        dataCtrl.clearData();
        UICtrl.clearAllEntries();
        UICtrl.clearFields();
    }
    

    var calcResults = function() {
        var sys, dis;
        var avgs = dataCtrl.calcAvgs();
        sys = avgs[0];
        dis = avgs[1];
        
        // Test blood pressure range, call function to display modal in UICtrl
        if(sys < 120 && dis < 80) {
            UICtrl.displayModal('normal');
        } else if((sys >= 120 && sys <= 129) && dis <= 80 ) {
            UICtrl.displayModal('elevated');
        } else if ((sys >=130 && sys <= 140) || (dis > 80 && dis < 90)) {
            UICtrl.displayModal('hyp1');
        } else if ((sys > 140 && sys < 180) || (dis > 90 && dis < 120) ) {
            UICtrl.displayModal('hyp2');
        } else {
            UICtrl.displayModal('episode');
        }

    }

    return {
        init: function() {
            setUpEventListeners();
        }
    };

})(interfaceController, dataController);

controller.init();