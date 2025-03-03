import React from "react";
import { Helmet } from "react-helmet";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto p-6 text-gray-800 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">
        سياسة الخصوصية والشروط
      </h1>
      <Helmet>
        <title>سياسه الشروط والخصوصيه - سوق البلد </title>
        <meta
          name="description"
          content="صفحه من نحن لترد علي الاسئله الشائعه عن موقعنا ومتجرنا الالكتروني سوق البلد"
        />
      </Helmet>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-black">1. مقدمة</h2>
        <p>
          نُقدّر خصوصيتك ونلتزم بحماية بياناتك الشخصية. تشرح هذه السياسة كيفية
          جمع بياناتك الشخصية ومعالجتها واستخدامها عند تصفحك لموقعنا أو استخدام
          خدماتنا.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-black">
          2. جمع البيانات
        </h2>
        <p>
          نقوم بجمع بياناتك عند التسجيل، تقديم الطلبات، أو التواصل معنا.
          البيانات التي قد نجمعها تشمل اسمك، بريدك الإلكتروني، عنوانك، ومعلومات
          الدفع الخاصة بك عند إجراء عمليات الشراء.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-black">
          3. استخدام البيانات
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>معالجة الطلبات وتوفير المنتجات والخدمات.</li>
          <li>تحسين تجربة المستخدم وتحليل أداء الموقع.</li>
          <li>التواصل مع العملاء لتقديم الدعم أو العروض الخاصة.</li>
          <li>ضمان الامتثال للمتطلبات القانونية والتنظيمية.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-black">
          4. سياسة الكوكيز
        </h2>
        <p>
          نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربة التصفح، وتخصيص
          المحتوى، وتحليل استخدام الموقع. يمكنك تعطيل الكوكيز من خلال إعدادات
          المتصفح.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-black">
          5. مشاركة البيانات
        </h2>
        <p>
          نحن لا نبيع أو نشارك بياناتك الشخصية مع أطراف خارجية، باستثناء الحالات
          الضرورية مثل معالجة الدفع أو الامتثال للقوانين.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-black">6. الأمان</h2>
        <p>
          نتخذ تدابير أمان لحماية بياناتك من الوصول غير المصرح به، ولكن لا
          يمكننا ضمان أمان البيانات بنسبة 100٪ عبر الإنترنت.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-black">
          7. حقوق المستخدم
        </h2>
        <p>
          يحق لك طلب تعديل أو حذف بياناتك الشخصية، كما يمكنك إلغاء الاشتراك في
          الاتصالات التسويقية في أي وقت.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-black">8. التعديلات</h2>
        <p>
          نحتفظ بالحق في تعديل هذه السياسة في أي وقت. سيتم إخطار المستخدمين بأي
          تغييرات جوهرية عبر البريد الإلكتروني أو من خلال الموقع.
        </p>
      </section>

      <section className="text-center mt-6">
        <p>
          إذا كانت لديك أي استفسارات، لا تتردد في
          <a
            href="/contact"
            className="text-black underline hover:text-gray-800"
          >
            التواصل معنا
          </a>
          .
        </p>
      </section>
    </div>
  );
}
