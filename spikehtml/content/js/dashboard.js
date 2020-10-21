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

    var data = {"OkPercent": 97.45615397331918, "KoPercent": 2.543846026680827};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9743260912037431, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Check jmeter variables for tasklist id"], "isController": false}, {"data": [1.0, 500, 1500, "Check if task is created"], "isController": false}, {"data": [0.9718691645081622, 500, 1500, "TaskUpdate"], "isController": false}, {"data": [1.0, 500, 1500, "Check if Id hasnt updated"], "isController": false}, {"data": [0.9719850907779247, 500, 1500, "TaskReadAll"], "isController": false}, {"data": [0.8912363067292645, 500, 1500, "TaskListUpdate"], "isController": false}, {"data": [0.9716879381628618, 500, 1500, "TaskCreate"], "isController": false}, {"data": [0.9709236031927024, 500, 1500, "TaskListReadAll"], "isController": false}, {"data": [0.9720361990950226, 500, 1500, "TaskDelete"], "isController": false}, {"data": [1.0, 500, 1500, "Check if id hasn\'t updated"], "isController": false}, {"data": [0.971148628278565, 500, 1500, "TaskList Delete"], "isController": false}, {"data": [0.970933014354067, 500, 1500, "TaskListCreate"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 199619, 5078, 2.543846026680827, 4.697904508087774, 0, 996, 1.0, 6.0, 7.0, 10.0, 3387.276861467454, 1892.3275548248405, 474.6787246582926], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Check jmeter variables for tasklist id", 16689, 0, 0.0, 0.00904787584636582, 0, 3, 0.0, 0.0, 0.0, 0.0, 284.52332242225856, 94.48641762990998, 0.0], "isController": false}, {"data": ["Check if task is created", 16663, 0, 0.0, 0.008641901218268024, 0, 1, 0.0, 0.0, 0.0, 0.0, 284.1672635492343, 94.37341253218902, 0.0], "isController": false}, {"data": ["TaskUpdate", 16601, 463, 2.788988615143666, 6.298716944762357, 0, 840, 1.0, 6.0, 8.0, 150.0, 283.6226337729789, 97.68134311146041, 66.86620139410921], "isController": false}, {"data": ["Check if Id hasnt updated", 16585, 0, 0.0, 0.007114862827856484, 0, 1, 0.0, 0.0, 0.0, 0.0, 283.5139662894458, 94.15860104191597, 0.0], "isController": false}, {"data": ["TaskReadAll", 16634, 463, 2.783455572922929, 6.459781171095336, 0, 859, 2.0, 6.0, 9.0, 149.65000000000146, 284.06024795928823, 355.90291489847675, 50.160704717971925], "isController": false}, {"data": ["TaskListUpdate", 16614, 1804, 10.85831226676297, 6.67617671843022, 0, 790, 1.0, 6.0, 8.0, 154.6999999999971, 283.73808791884414, 101.29963834131742, 65.53992895446937], "isController": false}, {"data": ["TaskCreate", 16689, 467, 2.7982503445383187, 5.853196716400046, 0, 834, 1.0, 5.0, 7.0, 147.0, 284.5184717936478, 95.9513237443954, 63.73773057776566], "isController": false}, {"data": ["TaskListReadAll", 16663, 475, 2.8506271379703536, 10.373642201284273, 0, 828, 3.0, 9.0, 22.0, 212.36000000000058, 284.16241750370915, 636.0327131367349, 51.25092062236737], "isController": false}, {"data": ["TaskDelete", 16575, 461, 2.7812971342383106, 5.76090497737555, 0, 911, 1.0, 6.0, 8.0, 133.0, 283.4738588360042, 69.20980659750133, 57.1497248636076], "isController": false}, {"data": ["Check if id hasn\'t updated", 16601, 0, 0.0, 0.007770616227938064, 0, 1, 0.0, 0.0, 0.0, 0.0, 283.63232530326326, 94.40109172112592, 0.0], "isController": false}, {"data": ["TaskList Delete", 16585, 477, 2.8760928549894484, 5.584684956285824, 0, 743, 1.0, 6.0, 8.0, 126.0, 283.5091198140139, 69.31834238085266, 58.22764131117626], "isController": false}, {"data": ["TaskListCreate", 16720, 468, 2.799043062200957, 9.310107655502396, 0, 996, 2.0, 7.0, 11.0, 205.79000000000087, 283.7649774277859, 100.0117541516751, 64.37648766589729], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Value expected to match regexp \'Mondayyyyy\', but it did not match: \'[&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;]\'", 1, 0.019692792437967704, 5.009543179757438E-4], "isController": false}, {"data": ["500", 73, 1.4375738479716424, 0.0365696652122293], "isController": false}, {"data": ["Value expected to match regexp \'Mondayyyyy\', but it did not match: \'[&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;]\'", 1, 0.019692792437967704, 5.009543179757438E-4], "isController": false}, {"data": ["404", 1290, 25.403702244978337, 0.6462310701887095], "isController": false}, {"data": ["Value expected to match regexp \'Mondayyyyy\', but it did not match: \'[&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;]\'", 1, 0.019692792437967704, 5.009543179757438E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException\/Non HTTP response message: Address already in use: connect", 3706, 72.9814887751083, 1.8565367024181065], "isController": false}, {"data": ["Value expected to match regexp \'Mondayyyyy\', but it did not match: \'[&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;]\'", 1, 0.019692792437967704, 5.009543179757438E-4], "isController": false}, {"data": ["Value expected to match regexp \'Mondayyyyy\', but it did not match: \'[&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;]\'", 1, 0.019692792437967704, 5.009543179757438E-4], "isController": false}, {"data": ["Value expected to match regexp \'Mondayyyyy\', but it did not match: \'[&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;]\'", 2, 0.03938558487593541, 0.0010019086359514876], "isController": false}, {"data": ["Value expected to match regexp \'Mondayyyyy\', but it did not match: \'[&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;]\'", 1, 0.019692792437967704, 5.009543179757438E-4], "isController": false}, {"data": ["Value expected to match regexp \'Mondayyyyy\', but it did not match: \'[&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;]\'", 1, 0.019692792437967704, 5.009543179757438E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 199619, 5078, "Non HTTP response code: java.net.BindException\/Non HTTP response message: Address already in use: connect", 3706, "404", 1290, "500", 73, "Value expected to match regexp \'Mondayyyyy\', but it did not match: \'[&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;]\'", 2, "Value expected to match regexp \'Mondayyyyy\', but it did not match: \'[&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;]\'", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["TaskUpdate", 16601, 463, "Non HTTP response code: java.net.BindException\/Non HTTP response message: Address already in use: connect", 461, "404", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["TaskReadAll", 16634, 463, "Non HTTP response code: java.net.BindException\/Non HTTP response message: Address already in use: connect", 463, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["TaskListUpdate", 16614, 1804, "404", 1283, "Non HTTP response code: java.net.BindException\/Non HTTP response message: Address already in use: connect", 463, "500", 58, null, null, null, null], "isController": false}, {"data": ["TaskCreate", 16689, 467, "Non HTTP response code: java.net.BindException\/Non HTTP response message: Address already in use: connect", 467, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["TaskListReadAll", 16663, 475, "Non HTTP response code: java.net.BindException\/Non HTTP response message: Address already in use: connect", 466, "Value expected to match regexp \'Mondayyyyy\', but it did not match: \'[&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;]\'", 2, "Value expected to match regexp \'Mondayyyyy\', but it did not match: \'[&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;]\'", 1, "Value expected to match regexp \'Mondayyyyy\', but it did not match: \'[&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;]\'", 1, "Value expected to match regexp \'Mondayyyyy\', but it did not match: \'[&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;,&quot;tuesdayyyy&quot;]\'", 1], "isController": false}, {"data": ["TaskDelete", 16575, 461, "Non HTTP response code: java.net.BindException\/Non HTTP response message: Address already in use: connect", 458, "404", 3, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["TaskList Delete", 16585, 477, "Non HTTP response code: java.net.BindException\/Non HTTP response message: Address already in use: connect", 460, "500", 15, "404", 2, null, null, null, null], "isController": false}, {"data": ["TaskListCreate", 16720, 468, "Non HTTP response code: java.net.BindException\/Non HTTP response message: Address already in use: connect", 468, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
