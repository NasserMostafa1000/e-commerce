import React from "react";
import { Helmet } from "react-helmet";

export default function AboutUs() {
  return (
    <div
      className="about-us-container p-6 max-w-4xl mx-auto text-gray-800"
      style={{ textAlign: "center" }}
    >
      <Helmet>
        <title>من نحن - سوق البلد </title>
        <meta
          name="description"
          content="صفحه من نحن لترد علي الاسئله الشائعه عن موقعنا ومتجرنا الالكتروني سوق البلد"
        />
      </Helmet>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        🛍️ من نحن - سوق التجارة الإلكترونية الأفضل!
      </h1>

      <p className="text-lg leading-relaxed mb-4" style={{ direction: "rtl" }}>
        مرحبًا بك في{" "}
        <span className="font-semibold text-blue-500">متجرنا الإلكتروني</span>،
        المكان المثالي لتلبية جميع احتياجاتك بسهولة وسرعة! نحن متخصصون في تقديم
        منتجات عالية الجودة مع خدمة شحن سريعة وآمنة إلى جميع أنحاء العالم.
      </p>

      <h2 className="text-2xl font-semibold text-blue-500 mt-6 mb-3">
        🚀 لماذا نحن؟
      </h2>
      <ul className="list-disc pl-6 text-lg leading-relaxed">
        <li>
          منتجات متنوعة تشمل الإلكترونيات، الأزياء، الأدوات المنزلية، وأكثر!
        </li>
        <li>أسعار منافسة وعروض حصرية طوال العام.</li>
        <li>شحن سريع لجميع المناطق مع ضمان التوصيل في الوقت المحدد.</li>
        <li>
          طرق دفع آمنة وسهلة، تشمل الدفع عند الاستلام أو الدفع الإلكتروني.
        </li>
        <li>سياسة إرجاع مرنة تضمن رضا العملاء بنسبة 100٪.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-blue-500 mt-6 mb-3">
        📦 كيف يتم الشحن؟
      </h2>
      <p className="text-lg leading-relaxed mb-4">
        بمجرد إتمام طلبك، نقوم بإعداده وشحنه في أسرع وقت ممكن من خلال أفضل شركات
        الشحن. يمكنك تتبع طلبك من خلال رقم الطلب الذي يمكن ان تجده في قسم طلباتي
        .
      </p>

      <h2 className="text-2xl font-semibold text-blue-500 mt-6 mb-3">
        💬 دعم العملاء
      </h2>
      <p className="text-lg leading-relaxed mb-4">
        نؤمن بأن العميل هو الأساس، لذا نوفر خدمة دعم عملاء متاحة 24/7 للإجابة
        على استفساراتكم ومساعدتكم في كل خطوة من تجربتكم معنا. لا تترددوا في
        التواصل معنا عبر البريد الإلكتروني أو الهاتف.
      </p>

      <h2 className="text-2xl font-semibold text-blue-500 mt-6 mb-3">
        🌍 رؤيتنا
      </h2>
      <p className="text-lg leading-relaxed mb-4">
        نسعى لأن نكون الوجهة الأولى للتسوق الإلكتروني في العالم العربي، من خلال
        تقديم تجربة شراء فريدة وسهلة ومريحة، وضمان أعلى مستويات الجودة والخدمة.
      </p>

      <div className="text-center mt-6">
        <button
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700"
          onClick={() => (window.location.pathname = "/")}
        >
          تسوّق الآن
        </button>
      </div>
    </div>
  );
}
