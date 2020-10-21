# CrudFunctionalityJmeter
What is this for?
    
    I am using Jmeter to run the performance tests spike, endurance(soak), stress and load tests on my toDoList API!
Prequisites:
    
    Jmeter needs to be installed, the tests can be viewed within it's GUI, otherwise the tests can be ran with the CLI command:
    'jmeter -n -t "yourtests.jmx" -l "Output for csv/xml" -e -o "Output for HTML Report"'
    This will make a csv report and also a nice html for you to see online!
    
    You will need to fork and pull my SpringApi, then run this to test it on your own system!
    

This is the html output report for my load test, it has lots of extra statistics on top such as latency and average response time!
![alt text](https://i.imgur.com/q0i6kCO.png)


This is the csv report produced from my load test, it gives in depth details on response times and latency!
![alt text](https://i.imgur.com/iS5c01n.png)

The more users a test would have usually would harm the output and cause errors in the system, we bypassed this problem by using timers for our tests
