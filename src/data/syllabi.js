// DHU大学院 2026年度シラバスデータ
// Google Spreadsheet (ID: 1w76UXScforLpsFiM-NgH0fugEDmKzKSE) から抽出
import syllabusData from './syllabi.json';

const STATIC_SYLLABI = [
    // ===== 1Q =====
    { id: 1, name: "コンテンツデザインB", quarter: "1Q", day: "月", period: "7限", module: "応用・実践", type: "選択必修（D系）", credits: 1, capacity: 80, instructor: "末永 剛", keywords: ["デザイン", "アートディレクション", "広告", "生成AI", "画像生成"], desc: "生成AIを中心とした画像や動画のコントロールについて講義と実践を行う。目的に合ったツールを活かしたアウトプット力を身につけ、クリエイティブコントロールを身につけることを目的とする。", delivery: "対面+遠隔" },
    { id: 2, name: "デジタル表現基礎A（アダプティブラーニング）", quarter: "1Q", day: "月", period: "8限", module: "基礎・理論", type: "選択", credits: 1, capacity: 25, instructor: "石川 大樹", keywords: ["eラーニング", "自己調整学習", "アダプティブ・ラーニング", "アクティブ・ラーニング"], desc: "デジタルハリウッドの動画教材の学習を通じてクリエイティブツールの基礎の習得とeラーニングの能動的学習方法の習得を目指す。", delivery: "遠隔" },
    { id: 3, name: "先端科学原論", quarter: "1Q", day: "水", period: "7限", module: "基礎・理論", type: "必修", credits: 1, capacity: 80, instructor: "藤井 直敬", keywords: ["現実科学", "VR/AR/MR/XR", "哲学", "認知科学", "進化", "AI"], desc: "現実世界は過去の経験にもとづく認知的バイアスで構築された主観的現実である。本講義では、現実を改変し豊かな世界を作るための思想的基盤を獲得する。", delivery: "対面" },
    { id: 4, name: "知的財産原論", quarter: "1Q", day: "水", period: "7限", module: "基礎・理論", type: "選択", credits: 1, capacity: 80, instructor: "高瀬 亜富", keywords: ["著作権", "著作隣接権", "著作者人格権"], desc: "デジタル人材・クリエイターにとって必須の著作権法の知識を、裁判例を通して実践的に学ぶ。", delivery: "遠隔" },
    { id: 5, name: "アーキテクチャ原論B（ソフトウェア）", quarter: "1Q", day: "水", period: "8限", module: "基礎・理論", type: "選択", credits: 1, capacity: 25, instructor: "三淵 啓自", keywords: ["デジタル", "アナログ", "ハードウェア", "コンピューター", "ネットワーク"], desc: "Webサイトの企画立案・開発・運用に必要なシステムの基礎知識を得る。プラットフォーム、OS、開発言語の特徴を解説。", delivery: "遠隔" },
    { id: 6, name: "メディアプロデュース", quarter: "1Q", day: "水", period: "8限", module: "応用・実践", type: "選択必修（D系）", credits: 1, capacity: 80, instructor: "京極 一樹", keywords: ["クリエイティブ", "PR", "情報デザイン", "アイデア", "プロデュース", "広告", "コンテンツ"], desc: "メディア及び生活者に向けた情報発信について、クリエーティブ及びPRの観点を踏まえ実践力を獲得する。", delivery: "対面" },
    { id: 7, name: "グローバルプロジェクト特論", quarter: "1Q", day: "水", period: "8限", module: "応用・実践", type: "選択必修（D系）", credits: 1, capacity: 80, instructor: "山崎 富美", keywords: ["グローバル", "プロジェクトマネジメント", "マーケティング", "ソーシャルインパクト"], desc: "「世界を幸せにする」人材を育てることを目的として、社会課題に対するプロジェクト実務の基礎を学ぶ。", delivery: "対面+遠隔" },
    { id: 8, name: "デジタルマーケティング特論", quarter: "1Q", day: "金", period: "7限", module: "応用・実践", type: "選択必修（E系）", credits: 1, capacity: 80, instructor: "関 龍太郎", keywords: ["デジタルマーケティング", "デジタルメディア", "デジタルコンテンツ", "YouTube", "理論と実務の架橋"], desc: "トラディショナルメディアの構造からデジタル広告プラットフォームの基礎と応用、各種APIの仕様を事例を交え解説。", delivery: "対面" },
    { id: 9, name: "ビジネスプランニング特論", quarter: "1Q", day: "金", period: "7限", module: "基礎・理論", type: "選択", credits: 1, capacity: 80, instructor: "西原 祐一", keywords: ["ビジネスプランニング", "起業", "新規事業", "事業計画", "生成AI"], desc: "起業や新規事業立ち上げに必要なビジネスプランニングの要素と手順を解説。生成AIの活用方法も指導。", delivery: "遠隔" },
    { id: 10, name: "コンテンツマネジメント特論", quarter: "1Q", day: "金", period: "7限", module: "応用・実践", type: "選択必修（D系）", credits: 1, capacity: 80, instructor: "森 祐治", keywords: ["知的財産（IP）", "著作権", "資金調達", "ビジネスデザイン", "情報経済学"], desc: "知的財産（IP）とそれを基にした事業のデザインの基礎的な手法を理解する。", delivery: "対面" },
    { id: 11, name: "データサイエンス", quarter: "1Q", day: "金", period: "8限", module: "基礎・理論", type: "選択", credits: 1, capacity: 80, instructor: "矢崎 裕一", keywords: ["統計計算", "コンピュータ支援統計", "データサイエンス", "データ", "可視化"], desc: "データサイエンスの社会実装事例を知り、データ分析や可視化の手法を見定める力を養う。", delivery: "遠隔" },
    { id: 12, name: "アーキテクチャ原論A（コンピュータ）", quarter: "1Q", day: "金", period: "8限", module: "基礎・理論", type: "選択", credits: 1, capacity: 80, instructor: "橋本 昌嗣", keywords: ["GPU", "AI", "クラウド", "GUI", "モビリティ"], desc: "コンピュータのしくみをわかりやすく解説し、将来のコンピュータの進化を予見する力を養う。", delivery: "遠隔" },
    { id: 13, name: "アカデミックライティング特論", quarter: "1Q", day: "金", period: "8限", module: "基礎・理論", type: "選択", credits: 1, capacity: 80, instructor: "高木 亜有子", keywords: ["学術活動", "研究論文", "学会発表", "個人業績", "査読"], desc: "学術活動のための文章の基本的な記述方法と研究論文作成の方法論を学ぶ。", delivery: "遠隔" },

    // ===== 2Q =====
    { id: 14, name: "デジタルコミュニケーション原論", quarter: "2Q", day: "月", period: "7限", module: "基礎・理論", type: "選択", credits: 1, capacity: 80, instructor: "杉山 知之／木原 民雄", keywords: ["デジタライゼーション", "インタラクティブ", "The Media Lab", "AI", "DX"], desc: "アナログメディアからデジタルメディアへの移行を歴史的に振り返り、DXの本質を理解する。", delivery: "遠隔" },
    { id: 15, name: "デジタルテクノロジー原論", quarter: "2Q", day: "月", period: "8限", module: "基礎・理論", type: "選択", credits: 1, capacity: 80, instructor: "竹中 直純", keywords: ["デジタルテクノロジー", "テクノロジーカルチャー", "インターネット技術", "インターネット文化"], desc: "ハードウェア、OS、プログラミング、ソフトウェアプロダクトを総覧しシステムの概観を掴む。", delivery: "対面+遠隔" },
    { id: 16, name: "デジタルコンテンツ研究基礎", quarter: "2Q", day: "水", period: "7限", module: "基礎・理論", type: "選択", credits: 1, capacity: 80, instructor: "川島 浩誉", keywords: ["データと情報", "社会調査", "論理と構造", "リテラシー", "統計学基礎"], desc: "デジタルコンテンツを対象にした研究の基礎を身につける。アンケート調査やAI活用も扱う。", delivery: "遠隔" },
    { id: 17, name: "クリエイティブ特論B", quarter: "2Q", day: "水", period: "7限", module: "応用・実践", type: "選択必修（D系）", credits: 1, capacity: 25, instructor: "中橋 敦", keywords: ["クリエイティブ", "広告", "テクノロジー", "AI", "アイデア"], desc: "テクノロジーの進化とともに発展してきたクリエイティブの歴史と最新事例を学ぶ。", delivery: "対面+遠隔" },
    { id: 18, name: "サービスプロトタイピングA", quarter: "2Q", day: "水", period: "7限", module: "応用・実践", type: "選択必修（E系）", credits: 1, capacity: 25, instructor: "山崎 大助", keywords: ["プロトタイプ作成", "プログラミング", "Web", "JavaScript"], desc: "Webアプリケーションのモックアップ・プロトタイピングを実践し、制作力を身につける。", delivery: "遠隔" },
    { id: 19, name: "デジタルコンテンツ総合研究", quarter: "2Q", day: "水", period: "8限", module: "基礎・理論", type: "必修", credits: 1, capacity: 80, instructor: "木原 民雄", keywords: ["デジタルコンテンツ", "デジタルメディア", "デジタルコミュニケーション", "研究と実践"], desc: "デジタルコンテンツに関連する研究領域を総合的に概観し、理論の確立と体系化を試みる必修科目。", delivery: "遠隔" },
    { id: 20, name: "先端マーケティング原論", quarter: "2Q", day: "水", period: "8限", module: "基礎・理論", type: "選択", credits: 1, capacity: 80, instructor: "吉田 康祐", keywords: ["インターネットマーケティング", "インターネット広告", "デジタルシフト", "事例分析"], desc: "インターネット広告の基礎から最新トレンドまで幅広く学び、実践のための基礎を身につける。", delivery: "対面" },
    { id: 21, name: "空間構成学", quarter: "2Q", day: "金", period: "7限", module: "基礎・理論", type: "選択", credits: 1, capacity: 80, instructor: "谷川 じゅんじ", keywords: ["空間デザイン", "体験デザイン", "パーパスデザイン", "未来志向デザイン"], desc: "空間を「場」として捉え、スペースコンポーズの視点からデザイン的に思考し実践化するプロセスを学ぶ。", delivery: "遠隔+対面" },
    { id: 22, name: "ファブリケーション特論", quarter: "2Q", day: "金", period: "7限", module: "基礎・理論", type: "選択", credits: 1, capacity: 25, instructor: "金井 隆晴", keywords: ["プロトタイピング", "デザイン", "ハードウェア", "デジタルファブリケーション"], desc: "CADとデジタルファブリケーション機器を活用したハードウェア具現化手法を実践的に学ぶ。", delivery: "対面" },
    { id: 23, name: "情報倫理と情報哲学", quarter: "2Q", day: "金", period: "7限", module: "基礎・理論", type: "選択", credits: 1, capacity: 80, instructor: "前田 邦宏", keywords: ["倫理学", "人工知能倫理", "サイバー法", "ダークパターン", "シンギュラリティ"], desc: "「情報圏」の中でより善く生きるための倫理について、古代ギリシャ哲学からAI倫理まで考察する。", delivery: "対面+遠隔" },
    { id: 24, name: "クラフトワーク特論", quarter: "2Q", day: "金", period: "8限", module: "応用・実践", type: "選択必修（E系）", credits: 1, capacity: 80, instructor: "吉田 知史", keywords: ["デジタルファブリケーション", "ものづくり", "手工芸", "プロトタイピング"], desc: "旧来の手工芸的なものづくりとデジタルファブリケーション技術による今日的なものづくりを学ぶ。", delivery: "対面+遠隔" },
    { id: 25, name: "アントレプレナー特論", quarter: "2Q", day: "金", period: "8限", module: "応用・実践", type: "選択必修（D系）", credits: 1, capacity: 25, instructor: "波木井 卓", keywords: ["アントレプレナー", "イントラプレナー", "ビジネスプラン", "起業", "新規事業"], desc: "ビジネスプラン作成ツールを学び、グループ・個人でビジネスプランを作成しプレゼンテーションを行う。", delivery: "対面" },
    { id: 26, name: "テクノロジー特論A（インターネット）", quarter: "2Q", day: "土", period: "3限", module: "応用・実践", type: "選択必修（E系）", credits: 1, capacity: 80, instructor: "藤川 真一", keywords: ["Web", "インターネット", "マーケティング", "プロジェクトマネジメント", "セキュリティ"], desc: "インターネットを支える基本的な技術の仕組みを理解し、Webサービスやビジネスへの応用力を養う。", delivery: "対面" },
    { id: 27, name: "スペキュラティブデザイン特論", quarter: "2Q", day: "土", period: "34限", module: "応用・実践", type: "選択必修（E系）", credits: 1, capacity: 25, instructor: "長谷川 敦士", keywords: ["スペキュラティブデザイン", "未来洞察", "シナリオプランニング"], desc: "スペキュラティブデザインの手法を通じて、未来のビジョンを批判的に思考する力を養う。", delivery: "遠隔" },
    { id: 28, name: "基礎造形", quarter: "2Q", day: "土", period: "34限", module: "基礎・理論", type: "選択", credits: 1, capacity: 25, instructor: "南雲 治嘉", keywords: ["造形", "色彩", "構成", "デザイン基礎"], desc: "デザインの基礎となる造形力を体系的に学ぶ。", delivery: "対面" },

    // ===== 夏季集中 =====
    { id: 29, name: "特別講義A", quarter: "夏季集中", day: "月火水木", period: "78限", module: "応用・実践", type: "選択", credits: 1, capacity: 80, instructor: "特別講師", keywords: ["特別講義"], desc: "夏季集中形式の特別講義。外部講師を招聘し特定テーマを深く学ぶ。", delivery: "集中" },
    { id: 30, name: "クリエイティブコンピュテーション", quarter: "夏季集中", day: "水", period: "78限", module: "応用・実践", type: "選択必修（E系）", credits: 1, capacity: 25, instructor: "特別講師", keywords: ["クリエイティブコーディング", "プログラミング", "アート"], desc: "プログラミングを用いたクリエイティブ表現の実践。", delivery: "集中" },
    { id: 31, name: "ウェブ解析実践", quarter: "夏季集中", day: "木", period: "78限", module: "応用・実践", type: "選択必修（E系）", credits: 1, capacity: 80, instructor: "特別講師", keywords: ["ウェブ解析", "アクセス解析", "データ分析"], desc: "ウェブサイトのアクセス解析の基礎から実践まで。", delivery: "集中" },
    { id: 32, name: "特別講義L", quarter: "夏季集中", day: "金", period: "78限", module: "応用・実践", type: "選択", credits: 1, capacity: 80, instructor: "特別講師", keywords: ["特別講義"], desc: "夏季集中形式の特別講義。", delivery: "集中" },
    { id: 33, name: "プロダクトプロトタイピングA", quarter: "夏季集中", day: "火/土", period: "78/34限", module: "応用・実践", type: "選択必修（E系）", credits: 1, capacity: 25, instructor: "特別講師", keywords: ["プロトタイピング", "プロダクト開発"], desc: "プロダクト開発のプロトタイピング手法を実践的に学ぶ。", delivery: "集中" },

    // ===== 3Q =====
    { id: 34, name: "デジタル表現基礎B", quarter: "3Q", day: "月", period: "8限", module: "基礎・理論", type: "選択", credits: 1, capacity: 25, instructor: "石川 大樹", keywords: ["eラーニング", "クリエイティブツール", "自己調整学習"], desc: "デジタル表現基礎Aの発展編。より高度なクリエイティブツールを動画教材で学ぶ。", delivery: "遠隔" },
    { id: 35, name: "エマージングテクノロジー", quarter: "3Q", day: "水", period: "7限", module: "基礎・理論", type: "選択", credits: 1, capacity: 80, instructor: "安藤 幸央", keywords: ["新興技術", "テクノロジートレンド", "イノベーション"], desc: "新興テクノロジーの動向と社会への影響を学ぶ。", delivery: "遠隔" },
    { id: 36, name: "特別講義T", quarter: "3Q", day: "水", period: "7限", module: "応用・実践", type: "選択", credits: 1, capacity: 80, instructor: "特別講師", keywords: ["特別講義", "テクノロジー"], desc: "テクノロジー分野の特別講義。", delivery: "対面+遠隔" },
    { id: 37, name: "先端芸術原論", quarter: "3Q", day: "水", period: "8限", module: "基礎・理論", type: "必修", credits: 1, capacity: 80, instructor: "特別講師", keywords: ["メディアアート", "デジタルアート", "芸術理論"], desc: "先端的な芸術表現の理論と実践を学ぶ。", delivery: "対面" },
    { id: 38, name: "知的財産活用実践", quarter: "3Q", day: "水", period: "8限", module: "応用・実践", type: "選択", credits: 1, capacity: 80, instructor: "高瀬 亜富", keywords: ["知的財産", "著作権活用", "ライセンス"], desc: "1Qの知的財産原論の発展。知的財産の実践的活用方法を学ぶ。", delivery: "遠隔" },
    { id: 39, name: "特別講義S", quarter: "3Q", day: "水", period: "8限", module: "応用・実践", type: "選択", credits: 1, capacity: 80, instructor: "特別講師", keywords: ["特別講義"], desc: "特別講義。外部講師を招聘。", delivery: "対面+遠隔" },
    { id: 40, name: "先端コンピュータグラフィックス原論", quarter: "3Q", day: "金", period: "7限", module: "基礎・理論", type: "選択", credits: 1, capacity: 80, instructor: "西田 友是", keywords: ["CG", "コンピュータグラフィックス", "レンダリング", "3DCG"], desc: "先端的なコンピュータグラフィックスの理論と応用を学ぶ。", delivery: "遠隔" },
    { id: 41, name: "プログラミング基礎Ⅰ", quarter: "3Q", day: "金", period: "7限", module: "基礎・理論", type: "選択", credits: 1, capacity: 25, instructor: "特別講師", keywords: ["プログラミング", "Python", "基礎"], desc: "プログラミングの基礎を学ぶ。変数、制御構造、関数等の基本概念を習得。", delivery: "遠隔" },
    { id: 42, name: "メディアアート特論", quarter: "3Q", day: "金", period: "8限", module: "応用・実践", type: "選択必修（D系）", credits: 1, capacity: 80, instructor: "特別講師", keywords: ["メディアアート", "インスタレーション", "デジタルアート"], desc: "メディアアートの理論と制作実践を深く学ぶ。", delivery: "対面" },
    { id: 43, name: "リアルタイムグラフィックス特論", quarter: "3Q", day: "金", period: "8限", module: "応用・実践", type: "選択必修（E系）", credits: 1, capacity: 25, instructor: "特別講師", keywords: ["リアルタイムCG", "Unity", "Unreal Engine", "シェーダー"], desc: "リアルタイムグラフィックスの技術と応用を実践的に学ぶ。", delivery: "対面" },
    { id: 44, name: "ストーリーテリング", quarter: "3Q", day: "土", period: "3限", module: "応用・実践", type: "選択必修（D系）", credits: 1, capacity: 80, instructor: "特別講師", keywords: ["ストーリーテリング", "ナラティブ", "脚本", "構成"], desc: "効果的なストーリーテリングの手法と構造を学ぶ。", delivery: "遠隔" },
    { id: 45, name: "デザインエンジニアリング", quarter: "3Q", day: "土", period: "34限", module: "応用・実践", type: "選択必修（E系）", credits: 1, capacity: 25, instructor: "特別講師", keywords: ["デザイン", "エンジニアリング", "プロトタイピング"], desc: "デザインとエンジニアリングを横断する実践的な開発手法を学ぶ。", delivery: "対面" },

    // ===== 4Q =====
    { id: 46, name: "ロボットデザイン", quarter: "4Q", day: "水", period: "7限", module: "応用・実践", type: "選択必修（E系）", credits: 1, capacity: 25, instructor: "特別講師", keywords: ["ロボット", "インタラクション", "デザイン", "AI"], desc: "ロボットのデザインとインタラクション設計を学ぶ。", delivery: "対面" },
    { id: 47, name: "先端マーケティング特論", quarter: "4Q", day: "水", period: "7限", module: "応用・実践", type: "選択必修（D系）", credits: 1, capacity: 80, instructor: "特別講師", keywords: ["マーケティング", "ブランディング", "戦略"], desc: "先端的なマーケティング手法と戦略を深く学ぶ。", delivery: "対面" },
    { id: 48, name: "コンテンツデザインA", quarter: "4Q", day: "金", period: "7限", module: "応用・実践", type: "選択必修（D系）", credits: 1, capacity: 80, instructor: "特別講師", keywords: ["コンテンツ", "デザイン", "企画", "制作"], desc: "コンテンツのデザインと企画制作を実践的に学ぶ。", delivery: "対面+遠隔" },
    { id: 49, name: "デジタルコンテンツの理論と実務の架橋", quarter: "4Q", day: "水", period: "8限", module: "基礎・理論", type: "必修", credits: 1, capacity: 80, instructor: "特別講師", keywords: ["デジタルコンテンツ", "理論", "実務", "架橋"], desc: "デジタルコンテンツ領域における理論と実務の橋渡しを行う必修科目。", delivery: "遠隔" },
    { id: 50, name: "テクノロジー特論B（データ）", quarter: "4Q", day: "水", period: "7限", module: "応用・実践", type: "選択必修（E系）", credits: 1, capacity: 80, instructor: "特別講師", keywords: ["データ", "分析", "AI", "機械学習"], desc: "データを活用した応用技術を実践的に学ぶ。", delivery: "遠隔" },
    { id: 51, name: "プログラミング基礎Ⅱ", quarter: "4Q", day: "金", period: "7限", module: "基礎・理論", type: "選択", credits: 1, capacity: 25, instructor: "特別講師", keywords: ["プログラミング", "Python", "応用"], desc: "プログラミング基礎Ⅰの発展。より実践的なプログラミングスキルを習得。", delivery: "遠隔" },
    { id: 52, name: "テクノロジー特論C", quarter: "4Q", day: "金", period: "78限", module: "応用・実践", type: "選択必修（E系）", credits: 1, capacity: 80, instructor: "三宅 陽一郎", keywords: ["AI", "ゲーム", "インタラクション"], desc: "テクノロジー分野の応用的な特論。最新技術とその活用を学ぶ。", delivery: "対面" },
    { id: 53, name: "テクノロジー特論D（人工現実）", quarter: "4Q", day: "金", period: "8限", module: "応用・実践", type: "選択必修（E系）", credits: 1, capacity: 80, instructor: "白井 暁彦", keywords: ["VR", "AR", "MR", "XR", "人工現実"], desc: "VR/AR/MR/XRを中心とした人工現実技術の理論と応用。", delivery: "対面+遠隔" },
    { id: 54, name: "サービスプロトタイピングB", quarter: "4Q", day: "土", period: "34限", module: "応用・実践", type: "選択必修（E系）", credits: 1, capacity: 25, instructor: "山崎 大助", keywords: ["Webアプリケーション", "プロトタイピング", "API"], desc: "サービスプロトタイピングAの発展編。より高度なWebアプリケーション開発を実践。", delivery: "遠隔" },

    // ===== 通年（修了課題・ラボプロジェクト） =====
    { id: 55, name: "修了課題構想", quarter: "通年", day: "土", period: "34限", module: "研究", type: "必修", credits: 1, capacity: null, instructor: "指導教員", keywords: ["修了課題", "研究構想", "テーマ設定"], desc: "修士課程の集大成となる修了課題の構想を行う。研究テーマの設定と計画立案。", delivery: "個別指導" },
    { id: 56, name: "修了課題計画", quarter: "通年", day: "土", period: "34限", module: "研究", type: "必修", credits: 1, capacity: null, instructor: "指導教員", keywords: ["修了課題", "研究計画", "中間発表"], desc: "修了課題の計画を具体化し、中間発表を行う。", delivery: "個別指導" },
    { id: 57, name: "修了課題制作", quarter: "通年", day: "土", period: "34限", module: "研究", type: "必修", credits: 6, capacity: null, instructor: "指導教員", keywords: ["修了課題", "論文", "制作", "最終発表"], desc: "修了課題の制作・論文執筆を行い、最終発表・審査を受ける。", delivery: "個別指導" },
    { id: 58, name: "ラボプロジェクト", quarter: "通年", day: "土", period: "34限", module: "研究", type: "選択必修", credits: 3, capacity: null, instructor: "指導教員", keywords: ["ラボ", "プロジェクト", "共同研究", "チーム"], desc: "研究室単位でのプロジェクト型研究活動。チームでの共同研究を通じて実践力を養う。", delivery: "個別指導" },
];

export const SYLLABI = STATIC_SYLLABI.map(s => {
    const detail = syllabusData.find(d =>
        d.subject.replace(/\s+/g, '') === s.name.replace(/\s+/g, '') ||
        s.name.includes(d.subject) ||
        d.subject.includes(s.name)
    );
    if (detail) {
        return {
            ...s,
            // syllabi.json で教員名・タイトル等が変更されていれば上書き
            ...(detail.instructor && { instructor: detail.instructor }),
            ...(detail.title && { name: detail.title }),
            overview: detail.overview,
            goals: detail.objectives,
            evaluation: detail.evaluation,
            textbook: detail.textbook,
            references: detail.references
        };
    }
    return { ...s, overview: s.desc };
});

// カテゴリ（モジュール）
export const MODULES = ["すべて", "基礎・理論", "応用・実践", "研究"];

// クォーター
export const QUARTERS = ["すべて", "1Q", "2Q", "夏季集中", "3Q", "4Q", "通年"];
