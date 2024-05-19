# node:cluster overview
Example demonstrates usage and performance of `node:cluster`.

> (disclaimer) Take the results with a pinch of salt. This is not a real app, testing environment is my pc.

In cluster, there are two roles:
- primary - the main process,
- worker - child process born with `cluster.fork()`.

In this example,
- primary's role is only to maintain pool of workers and 
- workers create and operate HTTP server app.

*Notice*
- Pool of workers use available parallelism from the OS
- HTTP server port is the same for all workers
- Workers are spawned with the same args as the main process

## Results
- There have not been much difference when the server did nothing
- Some have been noticeable when there was something to do - like a database query


<details>

<summary>No-cluster 171/s</summary>


```
     data_received..................: 425 MB 7.0 MB/s
     data_sent......................: 827 kB 14 kB/s
     http_req_blocked...............: avg=6.48µs   min=881ns   med=3.09µs   max=1.33ms   p(90)=4.18µs   p(95)=4.7µs   
     http_req_connecting............: avg=3.07µs   min=0s      med=0s       max=1.24ms   p(90)=0s       p(95)=0s      
     http_req_duration..............: avg=290.9ms  min=50.23ms med=331.05ms max=363.4ms  p(90)=344.15ms p(95)=347.43ms
       { expected_response:true }...: avg=290.9ms  min=50.23ms med=331.05ms max=363.4ms  p(90)=344.15ms p(95)=347.43ms
     http_req_failed................: 0.00%  ✓ 0          ✗ 10337
     http_req_receiving.............: avg=80.36µs  min=18.58µs med=77.42µs  max=1ms      p(90)=108.13µs p(95)=124.64µs
     http_req_sending...............: avg=14.62µs  min=4.57µs  med=14.02µs  max=1.07ms   p(90)=19.81µs  p(95)=21.74µs 
     http_req_tls_handshaking.......: avg=0s       min=0s      med=0s       max=0s       p(90)=0s       p(95)=0s      
     http_req_waiting...............: avg=290.8ms  min=50.16ms med=330.95ms max=363.31ms p(90)=344.05ms p(95)=347.33ms
     http_reqs......................: 10337  171.355262/s
     iteration_duration.............: avg=290.98ms min=50.27ms med=331.14ms max=363.49ms p(90)=344.24ms p(95)=347.51ms
     iterations.....................: 10337  171.355262/s
     vus............................: 50     min=50       max=50 
     vus_max........................: 50     min=50       max=50 


running (1m00.3s), 00/50 VUs, 10337 complete and 0 interrupted iterations
default ✓ [ 100% ] 50 VUs  1m0s
```

</details>

<details>

<summary>Cluster 258/s (+30%)</summary>

```
     data_received..................: 650 MB 11 MB/s
     data_sent......................: 1.2 MB 21 kB/s
     http_req_blocked...............: avg=11.15µs  min=985ns   med=7.29µs   max=4.31ms   p(90)=9.28µs   p(95)=10.36µs 
     http_req_connecting............: avg=3.24µs   min=0s      med=0s       max=1.92ms   p(90)=0s       p(95)=0s      
     http_req_duration..............: avg=193.02ms min=2.46ms  med=197.77ms max=486ms    p(90)=284.4ms  p(95)=300.88ms
       { expected_response:true }...: avg=193.02ms min=2.46ms  med=197.77ms max=486ms    p(90)=284.4ms  p(95)=300.88ms
     http_req_failed................: 0.00%  ✓ 0          ✗ 15550
     http_req_receiving.............: avg=266.17µs min=18.82µs med=187.77µs max=20.52ms  p(90)=405.68µs p(95)=474.84µs
     http_req_sending...............: avg=81.68µs  min=4.6µs   med=31.39µs  max=17.25ms  p(90)=44.9µs   p(95)=53.47µs 
     http_req_tls_handshaking.......: avg=0s       min=0s      med=0s       max=0s       p(90)=0s       p(95)=0s      
     http_req_waiting...............: avg=192.67ms min=2.41ms  med=197.4ms  max=485.77ms p(90)=284.08ms p(95)=300.52ms
     http_reqs......................: 15550  258.322869/s
     iteration_duration.............: avg=193.2ms  min=2.54ms  med=197.96ms max=486.16ms p(90)=284.58ms p(95)=301.05ms
     iterations.....................: 15550  258.322869/s
     vus............................: 50     min=50       max=50 
     vus_max........................: 50     min=50       max=50 


running (1m00.2s), 00/50 VUs, 15550 complete and 0 interrupted iterations
default ✓ [ 100% ] 50 VUs  1m0s
```

</details>

### Summary

Example demonstrates how easy it can be to convert a Node.js into a multi-process setup. 

Measurement shows some improvement on the performance, but it may vary depeneding on your user case.

### Reference
- https://nodejs.org/docs/latest/api/cluster.html