/* Original educational paraphrases, not quotations from an unavailable textbook. */
(function (root, factory) {
  const c = factory();
  if (typeof module === "object" && module.exports) module.exports = c;
  else root.VCX.define("learning/content", [], () => c);
})(globalThis, () => {
  const sourceNote =
    "Diễn giải học tập từ tình huống và tài liệu thiết kế của nhóm. Chưa có giáo trình/slide gốc trong repository; cần giảng viên đối chiếu thuật ngữ. Mọi số liệu và ngưỡng là giả định.";
  const concepts = {
    interests: {
      title: "Lợi ích kinh tế",
      remember:
        "Xem chủ thể nhận được gì, bỏ ra gì và chịu rủi ro nào trong hoạt động kinh tế.",
    },
    relations: {
      title: "Quan hệ lợi ích kinh tế",
      remember:
        "Lợi ích được thực hiện trong quan hệ giữa các chủ thể; điều kiện của bên này ảnh hưởng bên khác.",
    },
    unity: {
      title: "Sự thống nhất lợi ích",
      remember:
        "Có lợi ích chung khi cùng duy trì chuỗi, dù mục tiêu cụ thể của từng bên khác nhau.",
    },
    conflict: {
      title: "Mâu thuẫn lợi ích",
      remember:
        "Giá, chi phí và rủi ro có thể làm lợi ích riêng xung đột; cần làm rõ điều kiện thay vì quy lỗi đơn giản.",
    },
    collective: {
      title: "Lợi ích cá nhân, tập thể và xã hội",
      remember:
        "Quyền lợi hộ sản xuất, năng lực HTX và môi trường chung cần được xem xét đồng thời; hài hòa không phải chia đều.",
    },
    factors: {
      title: "Nhân tố ảnh hưởng đến quan hệ lợi ích",
      remember:
        "Thông tin, công nghệ, khả năng tổ chức và bối cảnh thị trường có thể thay đổi điều kiện thực hiện lợi ích trong tình huống này.",
    },
    state: {
      title: "Vai trò điều tiết của Nhà nước",
      remember:
        "Bảo vệ lợi ích hợp pháp, tạo điều kiện hợp tác, điều hòa, kiểm soát tác động tiêu cực và hỗ trợ giải quyết mâu thuẫn; tôn trọng tự nguyện.",
    },
    market: {
      title: "Kinh tế thị trường định hướng XHCN",
      remember:
        "Tình huống minh họa giao dịch theo cơ chế thị trường cùng điều tiết nhằm hài hòa lợi ích và quan tâm xã hội; không mô tả đầy đủ mọi đặc trưng của nền kinh tế.",
    },
  };
  const map = {
    field_cost: {
      concepts: ["interests", "factors"],
      actors: ["bay", "sen"],
      situation: "Chi phí công nghệ đã phát sinh dù liên kết tạm ngừng.",
      analysis:
        "Nông dân cần thu hồi chi phí; HTX cần giúp sử dụng công nghệ hiệu quả.",
      relation:
        "Đầu tư riêng cần điều kiện đầu ra và dịch vụ chung để tạo kết quả.",
      decision: "price / harmony",
    },
    field_sensor: {
      concepts: ["collective", "factors", "state"],
      actors: ["bay", "sen", "khoa"],
      situation: "Dữ liệu nguồn nước có thể báo trước rủi ro chung.",
      analysis:
        "Nông dân lo vụ mùa, HTX lo vận hành, doanh nghiệp lo lịch giao.",
      relation:
        "Chia sẻ dữ liệu giúp các bên chủ động nhưng vẫn phải kiểm chứng.",
      decision: "risk / prevent",
    },
    field_buyer: {
      concepts: ["conflict", "relations", "market"],
      actors: ["bay", "khoa"],
      situation: "Phiếu thu mua chưa nói rõ giá và thưởng chất lượng.",
      analysis:
        "Nông dân muốn dự toán thu nhập; doanh nghiệp cần chi phí gắn chất lượng.",
      relation:
        "Thỏa thuận minh bạch có thể làm giảm mâu thuẫn trong trao đổi.",
      decision: "price / rights",
    },
    coop_fees: {
      concepts: ["collective", "conflict", "relations"],
      actors: ["bay", "sen", "khoa"],
      situation:
        "Kho, kiểm định và điều phối có phí nhưng nghĩa vụ thanh toán còn trống.",
      analysis:
        "HTX cần nguồn lực dịch vụ; người dùng cần biết khoản phí tương ứng.",
      relation:
        "Minh bạch giúp nối lợi ích xã viên với năng lực tổ chức của tập thể.",
      decision: "fees / harmony / resolve",
    },
    coop_contract: {
      concepts: ["relations", "state"],
      actors: ["bay", "sen", "khoa"],
      situation:
        "Dự thảo 100 tấn thiếu phụ lục trách nhiệm và cách giải quyết bất đồng.",
      analysis: "Mỗi bên cần biết quyền yêu cầu, nghĩa vụ và mốc xử lý.",
      relation:
        "Khuôn khổ minh bạch hỗ trợ tự nguyện; không tự bảo đảm lợi nhuận.",
      decision: "rights / resolve",
    },
    coop_trace: {
      concepts: ["unity", "collective", "factors"],
      actors: ["bay", "sen", "khoa"],
      situation: "Truy xuất chỉ đầy đủ nếu cả chuỗi cùng cung cấp dữ liệu.",
      analysis: "HTX tổ chức hồ sơ; hộ sản xuất và doanh nghiệp cùng xác thực.",
      relation:
        "Lợi ích chung đòi hỏi đóng góp và trách nhiệm riêng của từng bên.",
      decision: "harmony / prevent",
    },
    factory_order: {
      concepts: ["interests", "unity", "market"],
      actors: ["khoa", "bay", "sen"],
      situation:
        "Doanh nghiệp có lịch chế biến, thiếu nguyên liệu có thể lỡ đơn hàng.",
      analysis:
        "Doanh nghiệp cần tiến độ; nông dân cần đầu ra; HTX cần lịch tập hợp khả thi.",
      relation: "Ba bên cùng bị ảnh hưởng khi liên kết gián đoạn.",
      decision: "price / risk",
    },
    factory_quality: {
      concepts: ["conflict", "state", "relations"],
      actors: ["bay", "khoa", "sen"],
      situation: "Chưa thống nhất cách đo và xử lý lô không đạt chất lượng.",
      analysis:
        "Doanh nghiệp cần nguyên liệu đạt chuẩn; nông dân cần quyền đối chiếu.",
      relation:
        "Kiểm định rõ căn cứ giảm bất cân xứng thông tin và tranh chấp.",
      decision: "rights / prevent",
    },
    factory_trucks: {
      concepts: ["unity", "factors", "relations"],
      actors: ["khoa", "sen", "bay"],
      situation:
        "Xe đã đặt lịch, thiếu nguyên liệu làm tăng chi phí điều phối.",
      analysis:
        "HTX cần lịch gom lúa, doanh nghiệp cần lịch xe, nông dân cần thời điểm nhận hàng.",
      relation:
        "Lịch chung phối hợp được lợi ích riêng nhưng có chi phí thay đổi kế hoạch.",
      decision: "risk / resolve / dock",
    },
  };
  const context = {
    price: "field_buyer",
    fees: "coop_fees",
    risk: "field_sensor",
    rights: "factory_quality",
    harmony: "field_cost",
    prevent: "field_sensor",
    resolve: "coop_contract",
    negotiation: "coop_contract",
  };
  // Every distractor has a specific explanation, including limits of the correct option.
  const quiz = [
    {
      concept: "interests",
      q: "Chú Bảy đã mua cảm biến nhưng mất đầu ra. Trước khi bàn giá, Minh An nên làm gì?",
      options: [
        "Chỉ hỏi mức giá mong muốn",
        "Đối chiếu chi phí, đầu ra và rủi ro thu nhập",
        "Bỏ qua chi phí đã phát sinh",
        "Cam kết bù mọi khoản lỗ",
      ],
      answer: 1,
      explain: [
        "Mức giá riêng chưa thể hiện đủ điều kiện thực hiện lợi ích.",
        "Đúng: nhận diện lợi ích gắn chi phí, đầu ra và rủi ro; chưa có nghĩa là mọi chi phí sẽ được bù.",
        "Chi phí vẫn ảnh hưởng khả năng duy trì sản xuất.",
        "Lời hứa bồi hoàn vô điều kiện không có căn cứ nguồn lực.",
      ],
    },
    {
      concept: "unity",
      q: "Nhà máy thiếu lúa, nông dân không bán được, HTX mất phí dịch vụ. Nhận định nào phù hợp?",
      options: [
        "Lợi ích ba bên hoàn toàn đồng nhất",
        "Chỉ doanh nghiệp bị thiệt",
        "Có lợi ích chung trong duy trì chuỗi dù mục tiêu riêng khác nhau",
        "Mâu thuẫn làm mọi hợp tác bất khả thi",
      ],
      answer: 2,
      explain: [
        "Cùng cần chuỗi không đồng nghĩa cùng mục tiêu và mức lợi ích.",
        "Cả ba đều chịu hệ quả gián đoạn.",
        "Đúng: sự thống nhất tạo cơ sở hợp tác, không xóa bỏ mâu thuẫn.",
        "Mâu thuẫn có thể được điều phối bằng điều kiện phù hợp.",
      ],
    },
    {
      concept: "collective",
      q: "Để giảm gánh nông dân, có đề xuất HTX ứng toàn bộ phí tới cuối vụ. Cần kiểm tra điều gì?",
      options: [
        "Dòng tiền HTX và lịch thu hồi, trách nhiệm chia sẻ",
        "Chỉ số hài lòng nông dân",
        "HTX là tập thể nên không cần nguồn lực",
        "Chuyển phí thành khoản không ghi sổ",
      ],
      answer: 0,
      explain: [
        "Đúng: bảo vệ xã viên cần cùng xem năng lực tổ chức dịch vụ và tính khả thi.",
        "Một bên hài lòng có thể che rủi ro phá vỡ dịch vụ chung.",
        "Kinh tế tập thể vẫn cần nguồn lực vận hành.",
        "Không ghi sổ làm giảm minh bạch và khó xác định trách nhiệm.",
      ],
    },
    {
      concept: "conflict",
      q: "Doanh nghiệp đề nghị giá theo từng đợt. Nông dân lo giá xuống sau kiểm định. Hướng điều chỉnh nào có căn cứ?",
      options: [
        "Cấm doanh nghiệp phản biện",
        "Ép nông dân nhận giá cuối vụ",
        "Tuyên bố thị trường tự giải quyết ngay mọi bất đồng",
        "Lập phụ lục bảo đảm tối thiểu và quy tắc kiểm định chung",
      ],
      answer: 3,
      explain: [
        "Áp đặt loại bỏ tự nguyện và không giải quyết khả năng thực hiện.",
        "Đẩy hết rủi ro biến động sang người sản xuất.",
        "Thông tin và điều khoản còn thiếu cần được các bên xử lý.",
        "Đúng: quy tắc minh bạch hỗ trợ thương lượng; mức cụ thể vẫn phải khả thi.",
      ],
    },
    {
      concept: "state",
      q: "Khi tranh cãi chất lượng, vai trò bảo vệ lợi ích hợp pháp nên thể hiện qua việc nào?",
      options: [
        "Buộc tất cả ký hợp đồng mới",
        "Cho phép đối chiếu phương pháp lấy mẫu và quyền khiếu nại",
        "Ấn định mỗi bên lời như nhau",
        "Hứa ngân sách mua hết lúa",
      ],
      answer: 1,
      explain: [
        "Ép ký không thay được sự tự nguyện và điều kiện lợi ích.",
        "Đúng: khuôn khổ kiểm chứng và quyền yêu cầu hỗ trợ bảo vệ quyền lợi.",
        "Hài hòa không đồng nghĩa chia đều và không có cơ sở xác định khoản lời.",
        "Cam kết ngân sách không được chứng minh trong tình huống.",
      ],
    },
    {
      concept: "factors",
      q: "Trạm nước báo độ mặn tăng nhưng chưa xác minh mức ảnh hưởng. Trình tự nào phù hợp?",
      options: [
        "Thông báo sớm → xác minh → phối hợp theo thỏa thuận",
        "Hủy ngay mọi nghĩa vụ → bỏ dữ liệu",
        "Chỉ thông báo sau khi giao hết lúa",
        "Đòi bồi thường trước khi kiểm tra",
      ],
      answer: 0,
      explain: [
        "Đúng trong luật chơi: cảnh báo sớm và kiểm chứng hỗ trợ quyết định; ứng phó thực tế còn phụ thuộc hướng dẫn chuyên môn.",
        "Một cảnh báo chưa chứng minh mức thiệt hại hay căn cứ hủy nghĩa vụ.",
        "Thông tin chậm có thể làm tăng thiệt hại chung.",
        "Yêu cầu cần chứng cứ và trách nhiệm được xác định.",
      ],
    },
    {
      concept: "collective",
      q: "Kiểm tra toàn bộ lô bảo vệ chất lượng nhưng gây chậm xe và tăng phí. Người điều phối cần nhìn nhận thế nào?",
      options: [
        "Cứ thận trọng là không có chi phí",
        "Ưu tiên lịch xe bất kể rủi ro",
        "Cân nhắc lợi ích cộng đồng cùng chi phí và tiến độ từng bên",
        "Giao hết trách nhiệm cho HTX",
      ],
      answer: 2,
      explain: [
        "Thận trọng cũng cần nguồn lực và thời gian.",
        "Bỏ rủi ro chung có thể gây thiệt hại dài hạn.",
        "Đúng: xem đồng thời lợi ích xã hội và khả năng thực hiện của chủ thể.",
        "HTX không tự có khả năng gánh mọi nghĩa vụ.",
      ],
    },
    {
      concept: "state",
      q: "Các bên còn bất đồng gay gắt. Chọn cơ chế pháp lý phù hợp có ý nghĩa gì?",
      options: [
        "Chứng minh bên kiện luôn đúng",
        "Bảo đảm lập tức khôi phục liên kết",
        "Nhà nước quyết định thay mọi giao dịch",
        "Bảo vệ quyền yêu cầu giải quyết, còn thời gian và khả năng hợp tác cần đánh giá",
      ],
      answer: 3,
      explain: [
        "Yêu cầu giải quyết không đồng nghĩa kết luận trách nhiệm.",
        "Quy trình có thể kéo dài và liên kết chưa hồi phục ngay.",
        "Khuôn khổ giải quyết không thay mọi quyết định thương mại.",
        "Đúng: quyền hợp pháp được bảo vệ, nhưng kết quả kinh tế không được bảo đảm vô điều kiện.",
      ],
    },
    {
      concept: "relations",
      q: "Tổng chỉ số mô phỏng cao nhưng Chị Sen chưa có tiền vận hành dịch vụ. Có thể kết luận gì?",
      options: [
        "Tổng cao nên HTX phải ký",
        "Cần xử lý điều kiện tối thiểu của HTX trước khi kết luận liên kết phục hồi",
        "Bỏ quyền lợi tập thể để tăng điểm",
        "Không cần thêm chứng cứ",
      ],
      answer: 1,
      explain: [
        "Tổng điểm không thay thế điều kiện thiết yếu và đồng thuận.",
        "Đúng: thiệt hại nghiêm trọng một chủ thể có thể phá tính khả thi toàn chuỗi.",
        "Điều đó tiếp tục làm đứt dịch vụ liên kết.",
        "Cần hồ sơ dòng tiền, nguồn lực và nghĩa vụ cụ thể.",
      ],
    },
    {
      concept: "market",
      q: "Ba bên tự thương lượng trong khuôn khổ minh bạch, có giám sát rủi ro xã hội. Tình huống minh họa điều gì?",
      options: [
        "Điều tiết thay thế hoàn toàn thị trường",
        "Chỉ lợi nhuận doanh nghiệp là mục tiêu",
        "Kết hợp cơ chế thị trường với điều tiết để hài hòa lợi ích và quan tâm xã hội",
        "Mọi thỏa thuận sẽ luôn có lợi nhuận",
      ],
      answer: 2,
      explain: [
        "Các chủ thể vẫn tự quyết định giao dịch và chịu trách nhiệm.",
        "Cần xét lợi ích cá nhân, tập thể và xã hội.",
        "Đúng như minh họa có giới hạn; đây không phải mô tả đầy đủ nền kinh tế thị trường định hướng XHCN.",
        "Rủi ro vẫn tồn tại và không thể bảo đảm lời cho mọi giao dịch.",
      ],
    },
  ];
  const debates = {
    bay: {
      title: "“Giá cao cố định mới bảo vệ được nông dân?”",
      concepts: [
        "Chỉ cần tối đa lợi ích một hộ",
        "Hài hòa lợi ích cần bảo đảm thu nhập và khả năng mua hàng",
        "Lợi ích chung làm mất lợi ích riêng",
      ],
      conceptAnswer: 1,
      proofs: ["field_buyer", "factory_order"],
      causes: [
        "Chưa rõ giá và tiêu chuẩn nên cả thu nhập lẫn chi phí đều khó dự toán",
        "Doanh nghiệp luôn có thể trả mọi mức giá",
        "HTX có thể chịu thay mọi thiệt hại",
      ],
      causeAnswer: 0,
      responses: [
        "Ép anh Khoa ký mức cao",
        "Để cuối vụ mới bàn giá",
        "Ghi giá tối thiểu có căn cứ, thưởng chất lượng và quy tắc đối chiếu",
      ],
      responseAnswer: 2,
      explanation:
        "Phiếu thu mua chỉ ra điều khoản trống; đơn hàng nhắc giới hạn phía mua. Bảo đảm thu nhập cần gắn tiêu chuẩn và năng lực thực hiện, không chỉ tăng giá.",
    },
    sen: {
      title: "“HTX cứ ứng phí thì xã viên được lợi, sao phải lo?”",
      concepts: [
        "Tập thể không có lợi ích kinh tế",
        "Lợi ích xã viên luôn đối lập HTX",
        "Lợi ích xã viên cần gắn với năng lực dịch vụ của HTX",
      ],
      conceptAnswer: 2,
      proofs: ["coop_fees", "coop_trace"],
      causes: [
        "Tập thể tự sinh ra vốn",
        "Ứng phí không có nguồn bù có thể làm gián đoạn dịch vụ cả chuỗi",
        "Chỉ thu nhập hộ sản xuất quan trọng",
      ],
      causeAnswer: 1,
      responses: [
        "Công khai phí, lịch thanh toán, xác nhận nguồn lực chia sẻ trước khi cam kết",
        "Để HTX tự xoay không thời hạn",
        "Ẩn chi phí để mọi người vui",
      ],
      responseAnswer: 0,
      explanation:
        "Sổ phí xác nhận dịch vụ và dòng tiền; truy xuất cho thấy đóng góp cả chuỗi. Minh bạch và nguồn lực có kiểm chứng giúp bảo vệ cả xã viên lẫn HTX.",
    },
    khoa: {
      title: "“Cứ hoãn cả lô cho chắc chất lượng?”",
      concepts: [
        "Bảo vệ lợi ích cần cân nhắc môi trường, tiến độ và trách nhiệm",
        "Tiến độ luôn hơn môi trường",
        "Thận trọng không tạo chi phí",
      ],
      conceptAnswer: 0,
      proofs: ["field_sensor", "factory_trucks", "factory_quality"],
      causes: [
        "Cảnh báo chứng minh mọi lô đều hỏng",
        "Xe trễ không ảnh hưởng ai",
        "Độ mặn phải xác minh; kiểm tra toàn bộ gây chi phí và chậm lịch",
      ],
      causeAnswer: 2,
      responses: [
        "Bỏ mọi cảnh báo để kịp xe",
        "Chia sẻ dữ liệu, xác minh vùng rủi ro, đối thoại điều chỉnh lịch và nghĩa vụ",
        "Hủy nghĩa vụ mà không xem hợp đồng",
      ],
      responseAnswer: 1,
      explanation:
        "Cảm biến xác lập cảnh báo chứ chưa kết luận chất lượng mọi lô. Tiêu chuẩn và lịch xe giúp lựa chọn phạm vi kiểm tra và điều chỉnh có căn cứ.",
    },
  };
  function gradeDebate(actor, selection) {
    const d = debates[actor];
    if (!d) return null;
    const concept = selection.concept === d.conceptAnswer;
    const cause = selection.cause === d.causeAnswer;
    const response = selection.response === d.responseAnswer;
    const proof = d.proofs.includes(selection.proof);
    const order = selection.order?.join(",") === "claim,evidence,response";
    return {
      rubric: [
        concept ? 2 : 0,
        order && cause ? 2 : order || cause ? 1 : 0,
        response && cause ? 2 : response ? 1 : 0,
        proof && cause ? 2 : proof ? 1 : 0,
      ],
      explanation: d.explanation,
      selection: JSON.parse(JSON.stringify(selection)),
    };
  }
  return { sourceNote, concepts, map, context, quiz, debates, gradeDebate };
});
