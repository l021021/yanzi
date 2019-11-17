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


var RecordArray = /*[{ "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792118522, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573792169924, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792178525, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573792230433, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792238242, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573792289308, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792298077, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573792348730, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792357769, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573792377583, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792378042, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792378071, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573792407696, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792418882, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573792466565, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792477847, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573792525604, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792536805, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573792586292, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792597580, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573792646965, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792658726, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573792708090, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792717592, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573792767899, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792777499, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573792828569, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792836927, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573792887915, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792896062, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573792948064, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573792957232, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793009020, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793016334, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793068010, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793069022, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793077138, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793129087, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793136117, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793190066, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793197114, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793250806, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793256995, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793309864, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793316010, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793369829, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793374931, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793430993, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793435640, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793491388, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793494958, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793551278, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793555626, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793610739, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793616576, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793616614, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793669709, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793676208, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793676245, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793729615, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793736676, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793789991, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793797770, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793850824, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793857283, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793910352, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793917665, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573793971339, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573793978708, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794032488, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794037603, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794091571, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794096766, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794150623, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794156911, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794210025, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794215733, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794270650, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794271663, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794274655, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794329832, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794333876, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794389928, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794392686, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794449885, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794452583, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794508764, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794511965, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794569253, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794573066, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794630112, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794634053, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794689737, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794693769, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794750644, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794753944, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794810068, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794814928, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794814968, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794870917, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794873865, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794873904, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794930814, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794934234, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573794990674, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573794994951, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795050859, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573795054594, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795110447, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573795115042, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795170293, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573795175373, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795230156, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573795234982, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795289981, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573795296175, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795350065, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573795355273, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795409963, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573795415511, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795469802, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795470811, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573795474754, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795530163, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573795534650, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795590267, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573795595041, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795649337, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573795654875, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795710054, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573795715186, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795769396, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573795774819, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795830584, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573795835856, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795890457, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573795896835, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573795951558, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573795957138, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796011120, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796016569, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796016610, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796071344, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796076695, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796076724, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796131196, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796137209, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796191193, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796196795, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796252113, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796256680, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796311674, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796317494, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796372103, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796376396, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796431054, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796435521, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796491998, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796496706, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796552189, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796556151, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796612061, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796616454, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796672633, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796673645, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796676869, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796733649, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796736204, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796793286, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796795553, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796852207, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796854427, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796911684, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796913971, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573796972558, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573796974296, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797033246, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797034444, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797094301, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797095367, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797153946, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797155922, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797214583, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797216930, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797216972, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797273582, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797277902, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797277931, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797333351, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797337314, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797393787, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797396205, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797454206, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797456421, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797515202, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797516790, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797575536, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797575949, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797635154, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797635256, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797694889, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797695559, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797755993, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797756426, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797815306, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797816741, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797875705, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797876552, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797876734, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797918316, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797918936, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797920450, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797936475, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797936805, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797951494, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797953008, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797953286, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797983923, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797985574, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573797996766, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573797996862, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798014083, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798015599, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798017156, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798049485, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798050498, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798057096, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798062418, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798063935, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798087014, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798109325, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798116289, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798120586, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798152037, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798152221, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798153734, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798169453, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798176324, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798204223, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798205738, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798229686, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798237115, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798237602, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798239114, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798264278, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798271654, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798290608, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798296157, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798302063, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798303578, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798307151, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798334455, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798349916, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798354679, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798357047, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798365118, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798365148, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798396227, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798405800, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798406812, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798416517, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798426557, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798426588, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798453438, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798457175, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798466825, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798476463, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798502384, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798503779, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798505302, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798525916, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798535973, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798560777, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798562293, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798582731, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798583742, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798596861, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798621609, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798623123, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798631324, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798641594, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798656152, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798700538, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798715535, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798715567, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798752663, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798752929, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798754449, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798760863, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798774968, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798785224, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798786745, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798820057, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798821326, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798835279, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798837316, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798853177, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798854689, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798868885, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798880901, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798888349, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798900139, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798931364, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798941051, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798949263, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573798949294, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798962472, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798997755, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573798998757, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799008175, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799030119, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799051681, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799053196, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799057749, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799061205, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799068306, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799092582, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799093268, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799094097, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799118641, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799119654, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799127068, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799129307, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799146420, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799147935, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799177614, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799183637, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799184827, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799217324, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799217360, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799217532, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799237891, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799243706, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799249172, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799249299, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799250685, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799282320, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799282332, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799297251, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799303963, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799317764, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799317953, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799319470, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799349623, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799356084, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799357094, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799364979, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799401283, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799401972, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799403488, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799416043, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799425350, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799453927, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799454136, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799455651, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799475846, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799484978, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799494227, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799494287, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799495743, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799528490, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799535031, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799544575, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799550057, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799559461, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799560977, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799583438, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799593735, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799594314, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799603850, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799615138, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799632137, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799632172, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799652473, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799653483, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799664415, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799671099, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799672614, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799701716, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799703366, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799713174, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799725374, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799733603, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799733804, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799735117, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799769130, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799772635, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799776093, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799785437, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799799870, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799801370, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799807854, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799833336, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799836724, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799839899, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799844459, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799871515, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799871638, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799873031, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799893837, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799904956, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799917281, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799917972, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799919486, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799948816, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799949600, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799949827, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799964802, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799979895, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573799980591, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573799981410, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573800008263, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573800012555, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573800013047, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573800024639, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573800042848, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573800044368, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573800044464, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573800067230, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573800074833, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573800076572, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573800085733, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573800105494, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573800107013, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573800127512, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573800137429, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573800146680, "value": "ot" }, { "type": "samplemotion", "Did": "EUI64-90FD9FFFFEA9505A-3-Motion", "timeStamp": 1573800152596, "value": "in" }, { "type": "samplemotion", "Did": "EUI64-D0CF5EFFFE793057-3-Motion", "timeStamp": 1573800167838, "value": "in" },*/ [{
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800169356,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800187785,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800193759,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800200187,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800235327,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800235357,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800237766,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800246845,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800260737,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800268210,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800269725,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800271957,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800301336,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800303202,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800304213,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800320331,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800343563,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800344112,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800345080,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800362922,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800376392,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800377419,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800415527,
    "value": "in"
}]

//console.log(RecordArray);
var t1 = new Date();
var t2 = new Date();
var t1m = new Date();
var timeArray = new Array();
var timeObj = {
    "ID": '',
    "timeStamp": '',
    "value": ''
}
//var t1s = new Date();
var t = new Date();
var t2m = new Date();
//t2s = new Date();

//处理一下 record，每一个ID分开成一个Array
RecordArray.method("groupby", function () {
    var array = new Array();

    for (let i = 0; i < this.length; i++) {
        const element = array[i];
        array[this.Did].push({
            "timeStamp": this.timeStamp,
            "value": this.value
        });
        return array;
    }
});

var splitedrecordArray = new Array();


var minDiff, Aftert1, Beforet2;


//var recordArraybyId = new Array();

splitedrecordArray = RecordArray.groupby();

for (let i = 1; i < RecordArray.length; i++) { //start from Second element //TODO 重大错误；ID没有分开

    t1.setTime(RecordArray[i - 1].timeStamp); //前一个事件时间
    t1.setMilliseconds(0); //得到整秒
    t1m.setTime(RecordArray[i - 1].timeStamp); //t1m：前一个事件的整分
    t1m.setMilliseconds(0);
    t1m.setSeconds(0); //得到整分

    t2.setTime(RecordArray[i].timeStamp); //当前事件时间
    t2.setMilliseconds(0); //得到整秒
    t2m.setTime(RecordArray[i].timeStamp);
    t2m.setMilliseconds(0);
    t2m.setSeconds(0); //second=0
    timeObj.ID = RecordArray[i].Did; //得到整分

    //得到分钟差和秒数零头

    minDiff = Math.floor((t2m - t1m) / 60 / 1000); //整分差
    t1ToNext = 60 - t1.getSeconds(); //前面的零头秒数
    PrevTot2 = t2.getSeconds(); //后面的零头秒数

    console.log(t1.toLocaleTimeString() + '-前  ' + t1m.toLocaleTimeString() + '整  ' + minDiff + ' 分 ' + t1ToNext + '前 ' + PrevTot2 + ' 后  ' + t2.toLocaleTimeString() + '-后  ' + t2m.toLocaleTimeString());

    if (RecordArray[i].value == 'in' && RecordArray[i - 1].value == 'in') { //全部=1
        console.log(RecordArray[i - 1].value + ' and ' + RecordArray[i].value)
        t.setTime(t1m); //前一整分

        let _RecordExist = false; //记录不存在
        let _ExistValue = 0;

        for (const key in timeArray) { //already exits in Array?

            if (timeArray[key].timeStamp == t.toLocaleTimeString() && timeArray[key].ID == RecordArray[i].Did) {

                console.log('这一分存在！' + t.toLocaleTimeString() + '   ' + JSON.stringify(timeArray[key]) + '  ' + JSON.stringify(RecordArray[i]))

                _RecordExist = true;
                _ExistValue = timeArray[key].value;
                timeArray[key].value = _ExistValue + t1ToNext / 60; //增加新的占用


                // continue;
            }


        }
        if (!_RecordExist) { //这一分不存在
            timeObj.timeStamp = t.toLocaleTimeString();
            timeObj.value = t1ToNext / 60;

            var _timeObj = JSON.parse(JSON.stringify(timeObj));
            timeArray.push(_timeObj); //增加记录

        }

        { //tail一定不会重复
            timeObj.timeStamp = t2m.toLocaleTimeString();
            timeObj.value = PrevTot2 / 60;

            var _timeObj = JSON.parse(JSON.stringify(timeObj));
            timeArray.push(_timeObj);
        }


        //process middle 
        let j = 1;
        while (j < minDiff) {
            t1m.setTime(t1m.getTime + j * 60 * 1000);
            timeObj.timeStamp = t1m.toLocaleTimeString();
            timeObj.value = 1;

            var _timeObj = JSON.parse(JSON.stringify(timeObj));
            timeArray.push(_timeObj);
            timeArray.push(t1m.toLocaleTimeString(), 1);
            j++

        }


    } else { //全部标0
        // var t = new Date();
        t.setTime(t1m); //Previous

        let _RecordExist = false;
        let _ExistValue = 0;

        //console.log(t.toLocaleTimeString());

        for (const key in timeArray) { //already exits in Array?

            if (timeArray[key].timeStamp == t.toLocaleTimeString() && timeArray[key].ID == RecordArray[i].Did) {

                console.log('这一分存在！' + t.toLocaleTimeString() + '   ' + JSON.stringify(timeArray[key]) + '  ' + JSON.stringify(RecordArray[i]))
                _RecordExist = true;
                _ExistValue = timeArray[key].value;
            }

            //do nothing
        }
        if (!_RecordExist) { //这一分不存在
            timeObj.timeStamp = t.toLocaleTimeString();
            timeObj.value = 0;

            var _timeObj = JSON.parse(JSON.stringify(timeObj));
            timeArray.push(_timeObj); //增加记录

        }

        { //tail一定不会重复
            timeObj.timeStamp = t2m.toLocaleTimeString();
            timeObj.value = 0;

            var _timeObj = JSON.parse(JSON.stringify(timeObj));
            timeArray.push(_timeObj);
        }


        //process middle 
        let j = 1;
        while (j < minDiff) {
            t1m.setTime(t1m.getTime + j * 60 * 1000);
            timeObj.timeStamp = t1m.toLocaleTimeString();
            timeObj.value = 0;

            var _timeObj = JSON.parse(JSON.stringify(timeObj));
            timeArray.push(_timeObj);
            timeArray.push(t1m.toLocaleTimeString(), 1);
            j++

        }

    }
}

//console.log(JSON.stringify(timeArray))

timeArray.sort(function (a, b) {
    //if (a.ID > b.ID) { return true } else
    if (a.timeStamp > b.timeStamp) {
        return true
    };
    return false;

})



for (let i = 0; i < timeArray.length; i++) {
    const element = timeArray[i];

    if (!element.ID || !element.timeStamp) continue;
    console.log(element.ID + ' @ ' + element.timeStamp + ' = ' + element.value + '')

}