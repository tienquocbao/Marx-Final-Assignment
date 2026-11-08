/* Shared scenario catalog: browser and deterministic simulation tests. */
(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else root.VCX.define("data", [], () => data);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const SCENES = {
    field: {
      name: "Cánh đồng chú Bảy",
      icon: "🌾",
      bg: "field",
      person: "chu_bay",
      character: "Chú Bảy",
      job: "Nông dân",
      line: "“Tui muốn làm lúa chất lượng, nhưng tiền mua cảm biến đã bỏ ra rồi. Giờ giá lại chưa rõ, ai mà không lo?”",
      hotspots: [
        {
          id: "field_cost",
          icon: "🧾",
          name: "Sổ đầu tư",
          x: 22,
          y: 63,
          details:
            "Chú Bảy đã bỏ chi phí mua thiết bị cảm biến và tham gia tập huấn. Đây là khoản chi thực tế, không tự mất đi khi hủy liên kết.",
          lesson: "Lợi ích nông dân gắn với chi phí và khả năng thu hồi vốn.",
          mood: "worried",
        },
        {
          id: "field_sensor",
          icon: "📡",
          name: "Trạm cảm biến",
          x: 69,
          y: 34,
          details:
            "Cảm biến giúp theo dõi điều kiện canh tác, đồng thời phát cảnh báo khi nguồn nước có biến động. Dữ liệu này cần được chia sẻ cho các bên.",
          lesson:
            "Công nghệ hỗ trợ năng suất và quản lý rủi ro, nhưng cần phối hợp.",
          mood: "thinking",
        },
        {
          id: "field_buyer",
          icon: "📃",
          name: "Phiếu thu mua",
          x: 48,
          y: 76,
          details:
            "Mức giá dự kiến không kèm quy tắc rõ ràng về thưởng chất lượng và cách điều chỉnh khi điều kiện thay đổi. Chú Bảy sợ bị ép vào thế bị động.",
          lesson: "Mâu thuẫn về giá xuất phát từ vị thế và lợi ích khác nhau.",
          mood: "stressed",
        },
      ],
    },
    coop: {
      name: "HTX Cồn Xanh",
      icon: "🏘️",
      bg: "coop",
      person: "chi_sen",
      character: "Chị Sen",
      job: "Giám đốc hợp tác xã",
      line: "“HTX lo kho, kiểm định và truy xuất. Mà những khoản này cứ ghi chung chung là hỗ trợ, biết thu ở đâu?”",
      hotspots: [
        {
          id: "coop_fees",
          icon: "🧮",
          name: "Sổ phí dịch vụ",
          x: 22,
          y: 66,
          details:
            "Các khoản kho bãi, điều phối và lấy mẫu đã phát sinh, nhưng phụ lục hợp đồng chưa xác định rõ bên nào thanh toán từng khoản.",
          lesson: "HTX cần nguồn lực để thực hiện chức năng liên kết.",
          mood: "stressed",
        },
        {
          id: "coop_contract",
          icon: "📜",
          name: "Bản dự thảo",
          x: 73,
          y: 64,
          details:
            "Hợp đồng nguyên tắc nói đến sản lượng 100 tấn nhưng bỏ trống nhiều nội dung về tiêu chuẩn cuối cùng, phí dịch vụ và xử lý tranh chấp.",
          lesson:
            "Luật chơi minh bạch giúp các chủ thể dự báo và bảo vệ lợi ích.",
          mood: "confused",
        },
        {
          id: "coop_trace",
          icon: "🔖",
          name: "Mã truy xuất",
          x: 50,
          y: 31,
          details:
            "Hệ thống truy xuất đã được HTX triển khai. Muốn tạo ra hàng hóa đạt chuẩn, cả ba bên phải cung cấp dữ liệu và thực hiện đúng quy trình.",
          lesson:
            "Lợi ích chung xuất hiện khi các bên hợp tác trong chuỗi giá trị.",
          mood: "thinking",
        },
      ],
    },
    factory: {
      name: "Nhà máy anh Khoa",
      icon: "🏭",
      bg: "factory",
      person: "anh_khoa",
      character: "Anh Khoa",
      job: "Đại diện doanh nghiệp",
      line: "“Tôi không nhận được lúa đúng kế hoạch thì dây chuyền chờ. Nếu chất lượng không đạt, tôi còn có thể mất đơn hàng.”",
      hotspots: [
        {
          id: "factory_order",
          icon: "📦",
          name: "Đơn hàng",
          x: 27,
          y: 69,
          details:
            "Doanh nghiệp đã lên lịch chế biến và giao hàng cho đối tác. Thiếu nguyên liệu đúng tiêu chuẩn có thể làm tăng chi phí hoặc chậm tiến độ.",
          lesson:
            "Lợi ích doanh nghiệp gắn với nguồn cung, tiêu chuẩn và tiến độ.",
          mood: "worried",
        },
        {
          id: "factory_quality",
          icon: "🔬",
          name: "Bảng tiêu chuẩn",
          x: 75,
          y: 32,
          details:
            "Quy cách sản phẩm cần kiểm định trước khi thanh toán nhưng chưa thống nhất phương pháp xác định chất lượng và cách xử lý lô không đạt.",
          lesson: "Minh bạch tiêu chuẩn làm giảm tranh chấp chất lượng.",
          mood: "confused",
        },
        {
          id: "factory_trucks",
          icon: "🚚",
          name: "Lịch xe thu mua",
          x: 61,
          y: 76,
          details:
            "Xe đã được đặt lịch nhưng không nhận đủ nguyên liệu. Tìm nhà cung cấp thay thế có thể khiến doanh nghiệp phải đổi kế hoạch.",
          lesson: "Đứt liên kết làm thiệt hại cả phía thu mua và chế biến.",
          mood: "stressed",
        },
      ],
    },
  };
  const POLICIES = [
    {
      id: "price",
      title: "GIÁ THU MUA & TIÊU CHUẨN",
      short: "Giá / chất lượng",
      explain:
        "Giá, kiểm định và thời điểm thanh toán tác động khác nhau đến ba bên.",
      choices: [
        {
          id: "fair",
          name: "Giá sàn có căn cứ + thưởng theo chất lượng kiểm định",
          delta: [19, 8, 9],
          accept:
            "Dễ dự toán cho nông dân nhưng phải có chi phí lấy mẫu và quy tắc kiểm định công khai.",
          ok: true,
        },
        {
          id: "phased",
          name: "Giá tham chiếu thị trường theo từng đợt, chốt sau kiểm định chung",
          delta: [8, 8, 18],
          accept:
            "Doanh nghiệp linh hoạt hơn; nông dân lo biến động giá, cần phụ lục bảo đảm tối thiểu.",
          ok: true,
        },
        {
          id: "premium",
          name: "Chốt giá cao từ đầu để giúp thu hồi vốn công nghệ",
          delta: [25, 1, -11],
          accept:
            "Nông dân an tâm hơn; doanh nghiệp chịu rủi ro nếu chất lượng hoặc giá tiêu thụ biến động.",
          ok: false,
        },
      ],
    },
    {
      id: "fees",
      title: "CHI PHÍ DỊCH VỤ HỢP TÁC XÃ",
      short: "Phí HTX",
      explain: "Ai ứng chi phí, ai trả sau và ai hưởng dịch vụ?",
      choices: [
        {
          id: "fair",
          name: "Công khai hóa đơn; phân phí theo dịch vụ mỗi bên thực dùng",
          delta: [10, 19, 9],
          accept:
            "Minh bạch nhưng cần thống nhất cách xác nhận từng khoản chi.",
          ok: true,
        },
        {
          id: "upfront",
          name: "Thu phí cố định đầu vụ để HTX chủ động vốn",
          delta: [-7, 23, 8],
          accept: "HTX vận hành chắc hơn nhưng nông dân cần vốn ban đầu.",
          ok: false,
        },
        {
          id: "deferred",
          name: "HTX ứng phí, thu lại sau khi lô lúa bán được",
          delta: [12, -12, 10],
          accept:
            "Giảm áp lực tiền mặt cho nông dân nhưng HTX phải gánh rủi ro dòng tiền.",
          ok: false,
        },
      ],
    },
    {
      id: "risk",
      title: "RỦI RO SẢN XUẤT & MÔI TRƯỜNG",
      short: "Rủi ro",
      explain:
        "Rủi ro không biến mất sau khi ký hợp đồng; phương án ứng phó cần cân bằng tiến độ và an toàn.",
      choices: [
        {
          id: "fair",
          name: "Cùng cảnh báo sớm; kiểm chứng dữ liệu; chia sẻ tổn thất theo trách nhiệm",
          delta: [18, 14, 14],
          accept: "Rõ trách nhiệm nhưng cần đầu tư vào phối hợp và hồ sơ.",
          ok: true,
        },
        {
          id: "reserve",
          name: "Trích quỹ dự phòng chung từ doanh thu vụ mùa",
          delta: [11, 7, 12],
          accept:
            "Có quỹ xử lý sự cố nhưng lợi nhuận mỗi bên giảm trong ngắn hạn.",
          ok: true,
        },
        {
          id: "pause",
          name: "Tạm hoãn giao toàn bộ lô để ưu tiên tái kiểm định",
          delta: [6, -6, -16],
          accept:
            "Giảm rủi ro chất lượng, nhưng chi phí kho và nguy cơ lỡ đơn hàng tăng.",
          ok: false,
        },
      ],
    },
  ];
  const CHARS = [
    { key: "chu_bay", name: "Chú Bảy", idx: 0 },
    { key: "chi_sen", name: "Chị Sen", idx: 1 },
    { key: "anh_khoa", name: "Anh Khoa", idx: 2 },
  ];
  const STATE_TOOLS = [
    {
      id: "rights",
      icon: "📜",
      role: "1",
      title: "Bảo vệ lợi ích hợp pháp và tạo môi trường thuận lợi",
      context:
        "Giá và tiêu chuẩn vẫn có điểm chưa được giải thích; quy trình kiểm chứng quan trọng hơn lời hứa.",
      clue: "Phiếu thu mua / dự thảo / tiêu chuẩn",
      proofs: ["field_buyer", "coop_contract", "factory_quality"],
      choices: [
        {
          id: "document",
          title: "Bổ sung phụ lục giá, phương pháp lấy mẫu và quyền khiếu nại",
          desc: "Rõ trách nhiệm; mất thời gian thống nhất và lập văn bản.",
          delta: [5, 5, 5],
          trust: 10,
          society: 3,
          good: true,
          reply:
            "Chú Bảy muốn bảo đảm giá; anh Khoa chấp nhận nếu hai bên cùng ký quy trình lấy mẫu.",
        },
        {
          id: "independent",
          title: "Kiểm định bởi đơn vị độc lập trước khi quyết định thanh toán",
          desc: "Tăng tính khách quan, đổi lại mất phí và có thể chậm giao hàng.",
          delta: [3, 3, -4],
          trust: 9,
          society: 6,
          good: true,
          reply:
            "Chị Sen tin kết quả hơn, nhưng doanh nghiệp đề nghị làm rõ ai chịu phí và hạn trả kết quả.",
        },
        {
          id: "template",
          title: "Dùng mẫu hợp đồng gọn, kiểm định nội bộ HTX theo hồ sơ chung",
          desc: "Nhanh hơn, chi phí thấp; cơ chế phản đối kết quả cần bổ sung.",
          delta: [3, 2, 5],
          trust: 3,
          society: 1,
          good: false,
          reply:
            "Anh Khoa tiết kiệm thời gian, nhưng chú Bảy muốn biết nếu có sai số thì phản đối thế nào.",
        },
      ],
    },
    {
      id: "harmony",
      icon: "🌱",
      role: "2",
      title: "Điều hòa lợi ích",
      context:
        "Đầu tư công nghệ, phí HTX và khả năng tiếp cận dịch vụ không giống nhau.",
      clue: "Sổ đầu tư / sổ phí / mã truy xuất",
      proofs: ["field_cost", "coop_fees", "coop_trace"],
      choices: [
        {
          id: "training",
          title:
            "Kết nối tập huấn sử dụng công nghệ và lịch hỗ trợ kỹ thuật công khai",
          desc: "Giảm thiếu thông tin và rủi ro vận hành; hiệu quả cần thời gian.",
          delta: [9, 5, 3],
          trust: 7,
          society: 6,
          good: true,
          reply:
            "Chú Bảy yên tâm hơn; HTX sẽ phải sắp xếp người hướng dẫn và lịch triển khai.",
        },
        {
          id: "credit",
          title:
            "Giới thiệu tiếp cận vốn/tín dụng phù hợp điều kiện, không hứa cấp ngay",
          desc: "Có thể giúp đầu tư sớm; người vay vẫn phải trả nợ và đáp ứng điều kiện.",
          delta: [12, 1, 4],
          trust: 4,
          society: 3,
          good: false,
          reply:
            "Chú Bảy thích giải pháp vốn, nhưng muốn biết lãi, thời hạn và rủi ro nợ.",
        },
        {
          id: "link",
          title: "Tổ chức cùng mua đầu vào và chia sẻ dịch vụ kỹ thuật qua HTX",
          desc: "Hiệu quả lâu dài hơn, cần sự tham gia thực chất của thành viên.",
          delta: [5, 11, 7],
          trust: 6,
          society: 5,
          good: true,
          reply:
            "Chị Sen ủng hộ, nhưng đòi cơ chế công khai chi phí vận hành chung.",
        },
      ],
    },
    {
      id: "prevent",
      icon: "📡",
      role: "3",
      title: "Kiểm soát, ngăn ngừa tác động tiêu cực",
      context:
        "Trạm nước báo độ mặn tăng; lựa chọn cần cân nhắc độ tin cậy, thời gian và chi phí.",
      clue: "Cảm biến / mã truy xuất / bảng tiêu chuẩn",
      proofs: ["field_sensor", "coop_trace", "factory_quality"],
      choices: [
        {
          id: "targeted",
          title:
            "Cảnh báo sớm, kiểm tra theo mức rủi ro và theo dõi vùng bất thường",
          desc: "Ít trì hoãn hơn kiểm tra toàn bộ, nhưng đòi hỏi dữ liệu đáng tin.",
          delta: [5, 4, 5],
          trust: 6,
          society: 12,
          good: true,
          reply:
            "Doanh nghiệp thấy đỡ chậm, nhưng hỏi cách chứng minh vùng được xếp mức rủi ro cao.",
        },
        {
          id: "full",
          title: "Kiểm tra lại toàn bộ lô trước khi giao",
          desc: "Tăng mức thận trọng; thời gian giao hàng và chi phí kiểm định tăng.",
          delta: [1, -6, -11],
          trust: 6,
          society: 17,
          good: true,
          reply: "HTX tin kết quả nhưng lo chi phí và lịch xe bị kéo dài.",
        },
        {
          id: "pause",
          title:
            "Hoãn bàn giao, tập trung kiểm soát nguồn nước rồi kiểm định lại",
          desc: "Ưu tiên kiểm soát sự cố môi trường; nguy cơ mất đơn hàng tăng.",
          delta: [4, -7, -15],
          trust: 2,
          society: 14,
          good: false,
          reply:
            "Chú Bảy muốn cứu vụ mùa, anh Khoa lo mất khách hàng nếu hoãn quá lâu.",
        },
      ],
    },
    {
      id: "resolve",
      icon: "🤝",
      role: "4",
      title: "Giải quyết mâu thuẫn lợi ích",
      context:
        "Sau khi tan rã, các bên cần một cơ chế đối thoại minh bạch và vẫn được tự quyết.",
      clue: "Phiếu thu mua / dự thảo / sổ phí HTX",
      proofs: ["field_buyer", "coop_contract", "coop_fees"],
      choices: [
        {
          id: "mediate",
          title: "Đối thoại ba bên, lập biên bản và mốc giải quyết tồn tại",
          desc: "Chi phí thấp hơn, nhưng phụ thuộc thiện chí và khả năng thực thi.",
          delta: [6, 7, 7],
          trust: 12,
          society: 4,
          good: true,
          reply:
            "Chị Sen chịu ký biên bản; chú Bảy yêu cầu thời hạn xử lý khoản phí rõ ràng.",
        },
        {
          id: "neutral",
          title: "Mời bên trung lập hỗ trợ hòa giải và đối chiếu chứng từ",
          desc: "Dễ tạo niềm tin khi căng thẳng cao; có thể tốn phí và thời gian.",
          delta: [4, 4, 4],
          trust: 11,
          society: 4,
          good: true,
          reply:
            "Anh Khoa chấp nhận bên trung lập, nhưng muốn chốt tiến độ trước vụ giao hàng.",
        },
        {
          id: "formal",
          title:
            "Chuyển tranh chấp chưa thể thống nhất sang cơ chế pháp lý phù hợp",
          desc: "Bảo vệ quyền yêu cầu xử lý, nhưng kéo dài thời gian và khó phục hồi quan hệ ngay.",
          delta: [0, -4, -5],
          trust: 3,
          society: 4,
          good: false,
          reply:
            "Không ai bị ép ký; liên kết có thể tạm ngưng cho tới khi tranh chấp được xử lý.",
        },
      ],
    },
  ];
  const KEY_CLUES = [
    {
      id: "field_buyer",
      icon: "📃",
      title: "Phiếu thu mua",
      info: "Giá và thưởng chất lượng",
    },
    {
      id: "coop_fees",
      icon: "🧮",
      title: "Sổ phí HTX",
      info: "Chi phí dịch vụ chưa rõ",
    },
    {
      id: "field_sensor",
      icon: "📡",
      title: "Trạm cảm biến",
      info: "Rủi ro độ mặn và nước",
    },
  ];
  const ISSUES = [
    {
      id: "price",
      title: "1. Tranh cãi giá – chất lượng",
      desc: "Giá mua và cách đánh giá chất lượng chưa minh bạch",
      clue: "field_buyer",
    },
    {
      id: "fees",
      title: "2. Tranh cãi phí dịch vụ",
      desc: "Cần xác định rõ khoản phí và trách nhiệm",
      clue: "coop_fees",
    },
    {
      id: "risk",
      title: "3. Rủi ro chung chưa có cách xử lý",
      desc: "Điều kiện canh tác thay đổi có thể làm đứt liên kết",
      clue: "field_sensor",
    },
  ];
  const NAMES = { field: "Chú Bảy", coop: "Chị Sen", factory: "Anh Khoa" };
  const INVITE_PEOPLE = [
    {
      id: "bay",
      char: "chu_bay",
      name: "Chú Bảy",
      job: "Nông dân",
      proof: "field_buyer",
      concern: "“Giá cả chưa rõ, tui có quay lại thì lỡ bị ép giá nữa sao?”",
      success:
        "“Có phiếu thu mua làm căn cứ thì mới nói chuyện được. Tui quay lại, nhưng phải bàn rõ giá và thưởng chất lượng!”",
      wrong:
        "“Tờ này không giải quyết nỗi lo về giá thu mua của tui. Bạn xem lại hợp đồng đi!”",
      lesson:
        "Bảo vệ lợi ích hợp pháp của người sản xuất bằng các điều kiện giao dịch minh bạch.",
    },
    {
      id: "sen",
      char: "chi_sen",
      name: "Chị Sen",
      job: "Hợp tác xã",
      proof: "coop_fees",
      concern:
        "“HTX không thể đứng ra điều phối nếu chẳng ai chịu thống nhất phí dịch vụ.”",
      success:
        "“Có sổ phí cụ thể thì sẽ phân trách nhiệm được. Tôi đồng ý tới, miễn mọi khoản phải minh bạch!”",
      wrong:
        "“Tôi cần bằng chứng về chi phí HTX đang phải gánh. Cái này chưa đúng chỗ.”",
      lesson: "Tạo môi trường hợp tác công bằng và minh bạch giữa các chủ thể.",
    },
    {
      id: "khoa",
      char: "anh_khoa",
      name: "Anh Khoa",
      job: "Doanh nghiệp",
      proof: "factory_quality",
      concern:
        "“Không có chuẩn kiểm định cụ thể thì tôi chưa biết nhận lô hàng nào.”",
      success:
        "“Bảng tiêu chuẩn làm rõ điều phải kiểm định. Tôi tới họp, nhưng phải thống nhất quy trình đánh giá chất lượng.”",
      wrong:
        "“Cần căn cứ về chất lượng lô hàng chứ không phải một lời hứa chung chung.”",
      lesson:
        "Điều hòa lợi ích bằng quy định rõ và cơ chế giải quyết bất đồng chất lượng.",
    },
  ];
  const PROOF_TITLES = Object.fromEntries(
    Object.values(SCENES).flatMap((d) => d.hotspots.map((h) => [h.id, h.name])),
  );
  return {
    SCENES,
    POLICIES,
    CHARS,
    STATE_TOOLS,
    KEY_CLUES,
    ISSUES,
    NAMES,
    INVITE_PEOPLE,
    PROOF_TITLES,
  };
});
