//处理逻辑：一分钟切片
//每一分钟 ：12:01:00 有一个对应的占用 0-1，比如0.5 :代表50%的利用率
//算法:每一个时间戳看前一个： 当前占用-前一个占用，标记为100%
// 当前占用 前一个空闲 标记为0
// 当前空闲 均标记为0
// 标记举例 1:01.11 in 1:05:44 in
//         1:01:00 49/60 
//         1:02:00 1 
//         1:03:00 1 
//         1:04:00 1 
//         1:05:00 1 
//         标记举例 1:01.11 out 1:05:44 in
//         1:01:00 0 
//         1:02:00 0 
//         1:03:00 0 
//         1:04:00 0 
//         1:05:00 16/60


var RecordArray;
RecordArray = [{ "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574135021868, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574135021868, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135021868, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574135026044, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574135026044, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574135034114, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574135076802, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574135103709, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574135110485, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574135116559, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7B282F-3-Motion", "timeStamp": 1574135131640, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135139539, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792CD8-3-Motion", "timeStamp": 1574135140562, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574135148706, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574135155663, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7B282F-3-Motion", "timeStamp": 1574135182306, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135182306, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792CD8-3-Motion", "timeStamp": 1574135182306, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574135191595, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574135191595, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574135207518, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574135223946, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135244009, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93F5C-3-Motion", "timeStamp": 1574135247362, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574135268624, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574135274848, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574135274848, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135274848, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93F5C-3-Motion", "timeStamp": 1574135290830, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE108D1B-3-Motion", "timeStamp": 1574135303424, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE108D1B-3-Motion", "timeStamp": 1574135311561, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574135357050, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135362689, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574135363601, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7B284B-3-Motion", "timeStamp": 1574135364431, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793ED2-3-Motion", "timeStamp": 1574135389088, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7B284B-3-Motion", "timeStamp": 1574135409964, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE108D1B-3-Motion", "timeStamp": 1574135425466, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574135428291, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793ED2-3-Motion", "timeStamp": 1574135437821, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574135440493, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135440493, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE108D1B-3-Motion", "timeStamp": 1574135481859, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574135483696, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574135493844, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135507809, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574135509603, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574135509620, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792C0A-3-Motion", "timeStamp": 1574135511826, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-0080E1030005453A-4-Motion", "timeStamp": 1574135514181, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE108D1B-3-Motion", "timeStamp": 1574135527838, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135550372, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574135550372, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792C0A-3-Motion", "timeStamp": 1574135556215, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-0080E1030005453A-4-Motion", "timeStamp": 1574135557896, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574135575772, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-0080E1030005453A-4-Motion", "timeStamp": 1574135604797, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574135615059, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574135634394, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135647858, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574135651020, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574135652191, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-0080E1030005453A-4-Motion", "timeStamp": 1574135652191, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7B284B-3-Motion", "timeStamp": 1574135692936, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135695613, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135695613, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE108D1B-3-Motion", "timeStamp": 1574135697122, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7B284B-3-Motion", "timeStamp": 1574135738204, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7B282F-3-Motion", "timeStamp": 1574135743891, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792CD8-3-Motion", "timeStamp": 1574135745058, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE108D1B-3-Motion", "timeStamp": 1574135745447, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574135770755, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135776433, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574135777763, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7B282F-3-Motion", "timeStamp": 1574135786598, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792CD8-3-Motion", "timeStamp": 1574135790045, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574135813845, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135820284, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574135829637, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574135837244, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574135852640, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135864528, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7B284B-3-Motion", "timeStamp": 1574135906975, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135925822, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574135933753, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7B284B-3-Motion", "timeStamp": 1574135950146, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574135969920, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135970933, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574135981331, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574135982079, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574135985321, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792C89-3-Motion", "timeStamp": 1574136007319, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574136022786, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574136027004, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574136027004, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574136027004, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574136027878, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574136029541, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792C89-3-Motion", "timeStamp": 1574136046905, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE108D1B-3-Motion", "timeStamp": 1574136046905, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574136062177, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574136063682, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574136067608, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE108D1B-3-Motion", "timeStamp": 1574136100590, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574136105594, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574136105594, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574136105594, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574136185542, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574136190962, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574136191464, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574136231893, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574136231893, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574136231893, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793ED2-3-Motion", "timeStamp": 1574136245729, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574136246036, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93F4E-3-Motion", "timeStamp": 1574136269681, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93F5C-3-Motion", "timeStamp": 1574136273180, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574136274045, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574136274714, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792CD8-3-Motion", "timeStamp": 1574136275557, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574136277477, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE108D1B-3-Motion", "timeStamp": 1574136279423, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793ED2-3-Motion", "timeStamp": 1574136285488, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574136293614, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93F4E-3-Motion", "timeStamp": 1574136316114, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93F5C-3-Motion", "timeStamp": 1574136318670, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574136318670, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574136319697, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792CD8-3-Motion", "timeStamp": 1574136319697, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574136319697, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE108D1B-3-Motion", "timeStamp": 1574136319697, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574136327914, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574136338288, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574136363187, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574136384637, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574136404928, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574136438026, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574136438026, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574136451679, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574136458365, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792CD8-3-Motion", "timeStamp": 1574136459240, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7B282F-3-Motion", "timeStamp": 1574136459659, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574136470463, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574136495660, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574136503590, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792CD8-3-Motion", "timeStamp": 1574136503590, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7B282F-3-Motion", "timeStamp": 1574136503590, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574136520639, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574136525791, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792CD8-3-Motion", "timeStamp": 1574136591974, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574136592699, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7B284B-3-Motion", "timeStamp": 1574136593240, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792C0A-3-Motion", "timeStamp": 1574136593521, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574136593645, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792CD8-3-Motion", "timeStamp": 1574136636245, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA950A1-3-Motion", "timeStamp": 1574136636245, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7B284B-3-Motion", "timeStamp": 1574136636245, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792C0A-3-Motion", "timeStamp": 1574136636245, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574136639255, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574136668336, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574136674742, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-90FD9FFFFEA93DB7-3-Motion", "timeStamp": 1574136713520, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE793DE3-3-Motion", "timeStamp": 1574136713520, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-0080E1030005453A-4-Motion", "timeStamp": 1574136713520, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574136727314, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-0080E1030005453A-4-Motion", "timeStamp": 1574136771235, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574136771235, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574136771235, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574136820807, "value": "nm" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7931C7-3-Motion", "timeStamp": 1574136828624, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE792C0A-3-Motion", "timeStamp": 1574136832006, "value": "mo" }, { "type": "sampleAsset", "Did": "EUI64-D0CF5EFFFE7B284B-3-Motion", "timeStamp": 1574136833236, "value": "mo" }]

var t1 = new Date();
var t2 = new Date();
var t1m = new Date();
var t = new Date();
var t2m = new Date();
var timeArray = new Array();
var timeObj = {
    "ID": '',
    "timeStamp": '',
    "value": ''
}

var minDiff, t1toNext, PrevTot2;

//处理一下 record，每一个ID分开成一个Array

var sArray = new Array();
var id = 'EUI64-90FD9FFFFEA9505A-3-Motion';


//var recordArraybyId = new Array();

for (let i = 0; i < RecordArray.length; i++) {

    if (id == RecordArray[i].Did) {
        sArray.push({
            "Did": id,
            "timeStamp": RecordArray[i].timeStamp,
            "value": RecordArray[i].value
        });
    }

}
// sArray = RecordArray.groupby("EUI64 - 90 FD9FFFFEA9505A - 3 - Motion");

for (let i = 1; i < sArray.length; i++) {

    t1.setTime(sArray[i - 1].timeStamp); //前一个事件时间
    t1.setMilliseconds(0); //得到整秒
    t1m.setTime(sArray[i - 1].timeStamp); //t1m：前一个事件的整分
    t1m.setMilliseconds(0);
    t1m.setSeconds(0); //得到整分

    t2.setTime(sArray[i].timeStamp); //当前事件时间
    t2.setMilliseconds(0); //得到整秒
    t2m.setTime(sArray[i].timeStamp);
    t2m.setMilliseconds(0);
    t2m.setSeconds(0); //second=0
    timeObj.ID = sArray[i].Did;

    //得到分钟差和秒数零头

    minDiff = Math.floor((t2m - t1m) / 60 / 1000); //整分差
    t1ToNext = 60 - t1.getSeconds(); //前面的零头秒数
    PrevTot2 = t2.getSeconds(); //后面的零头秒数

    console.log('seeing  ' + t1.toLocaleTimeString() + '-前  ' + t1m.toLocaleTimeString() + '整  ' + minDiff + ' 分 ' + t1ToNext + '前 ' + PrevTot2 + ' 后  ' + t2.toLocaleTimeString() + '-后  ' + t2m.toLocaleTimeString());

    if (sArray[i - 1].value == 'in') { //全部=1
        console.log('--is a in' + sArray[i - 1].value)

        console.log("same min" + (t1m == t2m) ? true : False);

        if (t1m >= t2m) {

            console.log("same min");
            t1ToNext = (t1ToNext + PrevTot2 - 60); ///计算缝隙
            PrevTot2 = 0; //计算头部即可

        }
        t.setTime(t1m); //前一整分

        let _RecordExist = false; //记录不存在
        let _ExistValue = 0;

        for (const key in timeArray) { //already exits in Array?

            if (timeArray[key].timeStamp == t.toLocaleTimeString()) {

                console.log('----这一分存在！加头部的数值' + t.toLocaleTimeString() + '   ' + JSON.stringify(timeArray[key]))

                _RecordExist = true;
                //_ExistValue = timeArray[key].value;
                timeArray[key].value += t1ToNext / 60; //增加新的占用


                break;
            }


        }
        if (!_RecordExist) { //这一分不存在
            timeObj.timeStamp = t.toLocaleTimeString();
            timeObj.value = t1ToNext / 60;

            var _timeObj = JSON.parse(JSON.stringify(timeObj));
            timeArray.push(_timeObj); //增加记录
            console.log('----这一分不存在！头部加入记录：' + t.toLocaleTimeString())

        }

        { //tail会重复？
            t.setTime(t2m); //tail
            for (const key in timeArray) { //already exits in Array?

                if (timeArray[key].timeStamp == t.toLocaleTimeString()) {

                    console.log('----这一分存在！加尾部数值  ' + t.toLocaleTimeString() + '   ' + JSON.stringify(timeArray[key]) + '  ' + JSON.stringify(sArray[i]))
                    _RecordExist = true;
                    timeArray[key].value += PrevTot2 / 60;
                    break;
                }
            }

            if (!_RecordExist) {

                timeObj.timeStamp = t2m.toLocaleTimeString();
                timeObj.value = PrevTot2 / 60;
                var _timeObj = JSON.parse(JSON.stringify(timeObj));
                timeArray.push(_timeObj);

                console.log('----不存在，加入新尾部记录：' + t2m.toLocaleTimeString());
            }

        }

        //process middle 
        let j = 1;
        console.log('----加入中部记录：');
        while (j < minDiff) {
            t1m.setTime(t1m.getTime + j * 60 * 1000);
            timeObj.timeStamp = t1m.toLocaleTimeString();
            timeObj.value = 1;

            var _timeObj = JSON.parse(JSON.stringify(timeObj));
            timeArray.push(_timeObj);
            // timeArray.push(t1m.toLocaleTimeString(), 1);
            j++
            console.log('------加入中部记录：' + t1m.toLocaleTimeString());
        }


    } else { //全部标0

        console.log('--is out ' + sArray[i - 1].value);
        t.setTime(t1m); //Previous

        let _RecordExist = false;
        console.log("same min" + (t1m == t2m) ? true : False);

        if (t1m >= t2m) {
            console.log("same min");
            t1ToNext = (t1ToNext + PrevTot2 - 60); ///计算缝隙
            PrevTot2 = 0; //计算头部即可

        } else { console.log('not same') };

        for (const key in timeArray) { //already exits in Array?

            if (timeArray[key].timeStamp == t.toLocaleTimeString()) {

                console.log('----这一分存在！头部原值不变 ' + t.toLocaleTimeString() + '   ' + JSON.stringify(timeArray[key]) + '  ' + JSON.stringify(sArray[i]))
                _RecordExist = true;
                _ExistValue = timeArray[key].value;
                break;
            }

            //do nothing
        }
        if (!_RecordExist) { //这一分不存在
            timeObj.timeStamp = t.toLocaleTimeString();
            timeObj.value = 0;

            var _timeObj = JSON.parse(JSON.stringify(timeObj));
            timeArray.push(_timeObj); //增加记录
            console.log('----这一分不存在！头部加入新记录：' + t.toLocaleTimeString())

        }

        { //tail会重复？
            t.setTime(t2m); //tail

            for (const key in timeArray) { //already exits in Array?

                if (timeArray[key].timeStamp == t.toLocaleTimeString()) {

                    console.log('----这一分存在！尾部原值不变 ' + t.toLocaleTimeString() + '   ' + JSON.stringify(timeArray[key]) + '  ' + JSON.stringify(sArray[i]))
                    _RecordExist = true;
                    // _ExistValue = timeArray[key].value;
                    break
                }
            }
            //do nothing
            if (!_RecordExist) {
                timeObj.timeStamp = t2m.toLocaleTimeString();
                timeObj.value = 0;

                var _timeObj = JSON.parse(JSON.stringify(timeObj));
                timeArray.push(_timeObj);
                console.log('----不存在，加入新尾部记录：' + t2m.toLocaleTimeString());
            }
        }
    }
    //process middle 
    let j = 1;
    console.log('----加入中部记录：');
    while (j < minDiff) {
        t1m.setTime(t1m.getTime + j * 60 * 1000);
        timeObj.timeStamp = t1m.toLocaleTimeString();
        timeObj.value = 0;

        var _timeObj = JSON.parse(JSON.stringify(timeObj));
        timeArray.push(_timeObj);
        console.log('----加入中部记录：' + t1m.toLocaleTimeString());
        // timeArray.push(t1m.toLocaleTimeString(), 1);
        j++

    }

}


console.log(JSON.stringify(timeArray))

// timeArray.sort(function (a, b) {
//     //if (a.ID > b.ID) { return true } else
//     if (a.timeStamp > b.timeStamp) {
//         return true
//     };
//     return false;

// });

console.log('timearray:');

for (let i = 0; i < timeArray.length; i++) {
    const element = timeArray[i];

    if (!element.ID || !element.timeStamp) continue;
    console.log(element.ID + ' @ ' + element.timeStamp + ' = ' + element.value + '')

};