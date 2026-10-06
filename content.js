const LESSON_DATA = {
    subject: "Hóa học",
    grade: "12",
    textbook: "Kết nối tri thức",
    title: "Bài 9: Amine",
    subtitle: "Học mà chơi • Tương tác • Tự kiểm tra • Tự động tính điểm",
    
    goals: [
        "Nêu được khái niệm, phân loại và danh pháp của amine.",
        "Trình bày được đặc điểm cấu tạo và tính chất vật lí của amine.",
        "Hiểu và giải thích được tính chất hóa học cơ bản của amine (tính base, phản ứng với nitrous acid, phản ứng thế ở nhân thơm)."
    ],

    sections: [
        {
            type: "mcq",
            title: "Dạng 1: Trắc nghiệm nhiều lựa chọn",
            questions: [
                {
                    question: "Chất nào sau đây thuộc loại amine bậc một?",
                    options: [
                        "CH3-NH-CH3",
                        "CH3-NH2",
                        "(CH3)3N",
                        "CH3-CH2-NH-CH3"
                    ],
                    answer: "CH3-NH2"
                },
                {
                    question: "Tên thay thế của CH3-CH2-NH2 là gì?",
                    options: [
                        "Methylamine",
                        "Ethylamine",
                        "Ethanamine",
                        "Methanamine"
                    ],
                    answer: "Ethanamine"
                }
            ]
        },
        {
            type: "truefalse",
            title: "Dạng 2: Đúng / Sai",
            questions: [
                {
                    text: "Aniline (C6H5NH2) là một chất lỏng, ít tan trong nước và làm quỳ tím hóa xanh.",
                    answer: "Sai"
                },
                {
                    text: "Methylamine, ethylamine là những chất khí có mùi khai tương tự amonia.",
                    answer: "Đúng"
                }
            ]
        },
        {
            type: "fill",
            title: "Dạng 3: Điền khuyết",
            questions: [
                {
                    prefix: "Dung dịch ethylamine làm quỳ tím chuyển sang màu ",
                    suffix: ".",
                    answers: ["xanh"]
                },
                {
                    prefix: "Công thức hóa học của aniline là ",
                    suffix: ".",
                    answers: ["C6H5NH2", "C₆H₅NH₂"]
                }
            ]
        },
        {
            type: "match",
            title: "Dạng 4: Nối cột (Ghép công thức với tên gọi thông thường)",
            questions: [
                {
                    colA: "CH3NH2",
                    colB: [
                        "Dimethylamine",
                        "Methylamine",
                        "Aniline",
                        "Ethylamine"
                    ],
                    answer: "Methylamine"
                },
                {
                    colA: "C6H5NH2",
                    colB: [
                        "Dimethylamine",
                        "Methylamine",
                        "Aniline",
                        "Ethylamine"
                    ],
                    answer: "Aniline"
                }
            ]
        },
        {
            type: "dragdrop",
            title: "Dạng 5: Kéo thả (Phân loại Amine)",
            cards: [
                { id: "item1", type: "text", label: "CH3-NH2" },
                { id: "item2", type: "text", label: "CH3-NH-CH3" },
                { id: "item3", type: "text", label: "(CH3)3N" },
                { id: "item4", type: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Aniline-2D-skeletal.svg/100px-Aniline-2D-skeletal.svg.png", label: "C6H5NH2" }
            ],
            targets: [
                { accept: "item1", text: "Amine bậc I (Gốc Alkyl)" },
                { accept: "item2", text: "Amine bậc II" },
                { accept: "item3", text: "Amine bậc III" },
                { accept: "item4", text: "Arylamine (Amine thơm)" }
            ]
        }
    ],

    remember: [
        "Amine được phân thành 3 bậc tùy thuộc vào số nguyên tử H trong NH3 bị thay thế.",
        "Các alkylamine (như methylamine) có lực base mạnh hơn amonia và làm xanh quỳ tím.",
        "Aniline có lực base rất yếu, không làm đổi màu quỳ tím, tạo kết tủa trắng với nước bromine."
    ]
};