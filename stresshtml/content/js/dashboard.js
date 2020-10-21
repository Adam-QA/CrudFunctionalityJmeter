/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.47522440497869, "KoPercent": 1.5247755950213158};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9779585038239894, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Check jmeter variables for tasklist id"], "isController": false}, {"data": [1.0, 500, 1500, "Check if task is created"], "isController": false}, {"data": [0.9889268010043134, 500, 1500, "TaskUpdate"], "isController": false}, {"data": [1.0, 500, 1500, "Check if Id hasnt updated"], "isController": false}, {"data": [0.9887218045112782, 500, 1500, "TaskReadAll"], "isController": false}, {"data": [0.8138667352714175, 500, 1500, "TaskListUpdate"], "isController": false}, {"data": [0.9886553006024869, 500, 1500, "TaskCreate"], "isController": false}, {"data": [0.9866893322214382, 500, 1500, "TaskListReadAll"], "isController": false}, {"data": [0.990357949048694, 500, 1500, "TaskDelete"], "isController": false}, {"data": [1.0, 500, 1500, "Check if id hasn\'t updated"], "isController": false}, {"data": [0.988305412371134, 500, 1500, "TaskList Delete"], "isController": false}, {"data": [0.9898488535929294, 500, 1500, "TaskListCreate"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 186716, 2847, 1.5247755950213158, 38.48738726193808, 0, 2800, 1.0, 10.0, 16.0, 409.0, 2082.0481941145645, 3186.1099183441775, 300.57190960258254], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Check jmeter variables for tasklist id", 15602, 0, 0.0, 0.008139982053582835, 0, 1, 0.0, 0.0, 0.0, 0.0, 174.12557755407246, 58.16629546494497, 0.0], "isController": false}, {"data": ["Check if task is created", 15589, 0, 0.0, 0.008082622361921843, 0, 1, 0.0, 0.0, 0.0, 0.0, 173.984375, 58.13000270298549, 0.0], "isController": false}, {"data": ["TaskUpdate", 15533, 0, 0.0, 53.29434108028078, 0, 2800, 2.0, 165.0, 311.0, 708.3199999999997, 173.36324471528383, 50.282112969179, 42.15571087315007], "isController": false}, {"data": ["Check if Id hasnt updated", 15520, 0, 0.0, 0.00844072164948456, 0, 1, 0.0, 0.0, 0.0, 0.0, 173.2220188401268, 57.87515974485468, 0.0], "isController": false}, {"data": ["TaskReadAll", 15561, 0, 0.0, 59.6699440909967, 1, 2118, 5.0, 174.0, 319.89999999999964, 710.3799999999992, 173.66799848217673, 985.9535191911174, 31.545163786801634], "isController": false}, {"data": ["TaskListUpdate", 15548, 2846, 18.304605093902754, 53.01189863648057, 0, 2628, 2.0, 162.0, 312.0, 684.0200000000004, 173.528722418777, 53.60732916592261, 41.348640888849204], "isController": false}, {"data": ["TaskCreate", 15602, 0, 0.0, 56.41885655685167, 0, 2160, 2.0, 184.0, 325.0, 671.9399999999987, 174.12557755407246, 49.142863196413025, 40.13050420191514], "isController": false}, {"data": ["TaskListReadAll", 15589, 0, 0.0, 79.82070690871804, 5, 2282, 16.0, 234.0, 359.0, 743.2000000000007, 173.9688420676725, 1700.9084119337838, 32.27937499302517], "isController": false}, {"data": ["TaskDelete", 15505, 0, 0.0, 49.2109642050952, 0, 2490, 2.0, 150.0, 291.6999999999989, 632.0, 173.08937462323337, 32.28522514945076, 36.00394218237179], "isController": false}, {"data": ["Check if id hasn\'t updated", 15533, 0, 0.0, 0.008755552694263863, 0, 1, 0.0, 0.0, 0.0, 0.0, 173.36324471528383, 58.19056019665618, 0.0], "isController": false}, {"data": ["TaskList Delete", 15520, 1, 0.006443298969072165, 52.783569587628904, 0, 1872, 2.0, 162.89999999999964, 312.0, 710.5799999999981, 173.2220188401268, 32.31169944459016, 36.708181726862804], "isController": false}, {"data": ["TaskListCreate", 15614, 0, 0.0, 57.53349558088877, 0, 2185, 3.0, 179.0, 310.0, 658.0, 174.13900785153461, 51.86757558077935, 40.64377234034841], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 10, 0.3512469265893923, 0.005355727414897492], "isController": false}, {"data": ["404", 2837, 99.6487530734106, 1.5194198676064183], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 186716, 2847, "404", 2837, "500", 10, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["TaskListUpdate", 15548, 2846, "404", 2837, "500", 9, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["TaskList Delete", 15520, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
