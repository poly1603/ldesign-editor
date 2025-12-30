/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var types = require('../types.cjs');

const meetingMinutesTemplate = {
  metadata: {
    id: "builtin-meeting-minutes",
    name: "\u4F1A\u8BAE\u7EAA\u8981",
    description: "\u6807\u51C6\u4F1A\u8BAE\u7EAA\u8981\u6A21\u677F\uFF0C\u5305\u542B\u4F1A\u8BAE\u57FA\u672C\u4FE1\u606F\u548C\u8BA8\u8BBA\u5185\u5BB9",
    category: types.TemplateCategory.BUSINESS,
    tags: ["\u4F1A\u8BAE", "\u7EAA\u8981", "\u5546\u52A1"],
    author: "System",
    isBuiltin: true
  },
  content: `
    <h1>\u4F1A\u8BAE\u7EAA\u8981</h1>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5; width: 120px;">\u4F1A\u8BAE\u4E3B\u9898</td>
        <td style="padding: 8px; border: 1px solid #ddd;">{{meetingTitle}}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;">\u4F1A\u8BAE\u65F6\u95F4</td>
        <td style="padding: 8px; border: 1px solid #ddd;">{{meetingDate}} {{meetingTime}}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;">\u4F1A\u8BAE\u5730\u70B9</td>
        <td style="padding: 8px; border: 1px solid #ddd;">{{location}}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;">\u4E3B\u6301\u4EBA</td>
        <td style="padding: 8px; border: 1px solid #ddd;">{{host}}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;">\u53C2\u4F1A\u4EBA\u5458</td>
        <td style="padding: 8px; border: 1px solid #ddd;">{{attendees}}</td>
      </tr>
    </table>
    
    <h2>\u4F1A\u8BAE\u8BAE\u7A0B</h2>
    <ol>
      <li>\u8BAE\u9898\u4E00</li>
      <li>\u8BAE\u9898\u4E8C</li>
      <li>\u8BAE\u9898\u4E09</li>
    </ol>
    
    <h2>\u4F1A\u8BAE\u5185\u5BB9</h2>
    <h3>1. \u8BAE\u9898\u4E00</h3>
    <p>\u8BA8\u8BBA\u5185\u5BB9...</p>
    <p><strong>\u51B3\u8BAE\uFF1A</strong></p>
    
    <h3>2. \u8BAE\u9898\u4E8C</h3>
    <p>\u8BA8\u8BBA\u5185\u5BB9...</p>
    <p><strong>\u51B3\u8BAE\uFF1A</strong></p>
    
    <h3>3. \u8BAE\u9898\u4E09</h3>
    <p>\u8BA8\u8BBA\u5185\u5BB9...</p>
    <p><strong>\u51B3\u8BAE\uFF1A</strong></p>
    
    <h2>\u4E0B\u4E00\u6B65\u884C\u52A8</h2>
    <ul>
      <li>\u884C\u52A8\u98791 - \u8D1F\u8D23\u4EBA\uFF1A{{person1}} - \u622A\u6B62\u65E5\u671F\uFF1A{{deadline1}}</li>
      <li>\u884C\u52A8\u98792 - \u8D1F\u8D23\u4EBA\uFF1A{{person2}} - \u622A\u6B62\u65E5\u671F\uFF1A{{deadline2}}</li>
    </ul>
    
    <p style="margin-top: 30px;">
      <strong>\u8BB0\u5F55\u4EBA\uFF1A</strong>{{recorder}}<br>
      <strong>\u65E5\u671F\uFF1A</strong>{{date}}
    </p>
  `,
  variables: [{
    key: "meetingTitle",
    label: "\u4F1A\u8BAE\u4E3B\u9898",
    type: "text",
    required: true
  }, {
    key: "meetingDate",
    label: "\u4F1A\u8BAE\u65E5\u671F",
    type: "date",
    required: true
  }, {
    key: "meetingTime",
    label: "\u4F1A\u8BAE\u65F6\u95F4",
    type: "text",
    defaultValue: "14:00"
  }, {
    key: "location",
    label: "\u4F1A\u8BAE\u5730\u70B9",
    type: "text",
    defaultValue: "\u4F1A\u8BAE\u5BA4"
  }, {
    key: "host",
    label: "\u4E3B\u6301\u4EBA",
    type: "text"
  }, {
    key: "attendees",
    label: "\u53C2\u4F1A\u4EBA\u5458",
    type: "text"
  }, {
    key: "recorder",
    label: "\u8BB0\u5F55\u4EBA",
    type: "text"
  }, {
    key: "date",
    label: "\u8BB0\u5F55\u65E5\u671F",
    type: "date"
  }]
};
const resumeTemplate = {
  metadata: {
    id: "builtin-resume",
    name: "\u4E2A\u4EBA\u7B80\u5386",
    description: "\u4E13\u4E1A\u7684\u4E2A\u4EBA\u7B80\u5386\u6A21\u677F",
    category: types.TemplateCategory.PERSONAL,
    tags: ["\u7B80\u5386", "\u6C42\u804C", "\u4E2A\u4EBA"],
    author: "System",
    isBuiltin: true
  },
  content: `
    <div style="max-width: 800px; margin: 0 auto;">
      <h1 style="text-align: center; color: #2c3e50;">{{name}}</h1>
      <p style="text-align: center; color: #666;">
        {{phone}} | {{email}} | {{location}}
      </p>
      
      <h2 style="color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 5px;">\u4E2A\u4EBA\u7B80\u4ECB</h2>
      <p>{{summary}}</p>
      
      <h2 style="color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 5px;">\u6559\u80B2\u80CC\u666F</h2>
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 10px 0 5px 0;">{{school}} <span style="float: right; font-weight: normal;">{{eduDate}}</span></h3>
        <p style="margin: 5px 0;">{{degree}} - {{major}}</p>
        <p style="margin: 5px 0;">GPA: {{gpa}}</p>
      </div>
      
      <h2 style="color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 5px;">\u5DE5\u4F5C\u7ECF\u5386</h2>
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 10px 0 5px 0;">{{company1}} - {{position1}} <span style="float: right; font-weight: normal;">{{workDate1}}</span></h3>
        <ul>
          <li>\u5DE5\u4F5C\u804C\u8D231</li>
          <li>\u5DE5\u4F5C\u804C\u8D232</li>
          <li>\u5DE5\u4F5C\u6210\u679C</li>
        </ul>
      </div>
      
      <h2 style="color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 5px;">\u4E13\u4E1A\u6280\u80FD</h2>
      <ul>
        <li><strong>\u7F16\u7A0B\u8BED\u8A00\uFF1A</strong>{{skills1}}</li>
        <li><strong>\u6846\u67B6\u5DE5\u5177\uFF1A</strong>{{skills2}}</li>
        <li><strong>\u5176\u4ED6\u6280\u80FD\uFF1A</strong>{{skills3}}</li>
      </ul>
      
      <h2 style="color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 5px;">\u9879\u76EE\u7ECF\u9A8C</h2>
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 10px 0 5px 0;">{{projectName}} <span style="float: right; font-weight: normal;">{{projectDate}}</span></h3>
        <p><strong>\u9879\u76EE\u63CF\u8FF0\uFF1A</strong>{{projectDesc}}</p>
        <p><strong>\u6280\u672F\u6808\uFF1A</strong>{{techStack}}</p>
        <p><strong>\u4E2A\u4EBA\u8D21\u732E\uFF1A</strong></p>
        <ul>
          <li>\u8D21\u732E1</li>
          <li>\u8D21\u732E2</li>
        </ul>
      </div>
    </div>
  `,
  variables: [{
    key: "name",
    label: "\u59D3\u540D",
    type: "text",
    required: true
  }, {
    key: "phone",
    label: "\u7535\u8BDD",
    type: "text"
  }, {
    key: "email",
    label: "\u90AE\u7BB1",
    type: "text"
  }, {
    key: "location",
    label: "\u6240\u5728\u5730",
    type: "text"
  }, {
    key: "summary",
    label: "\u4E2A\u4EBA\u7B80\u4ECB",
    type: "text"
  }]
};
const projectReportTemplate = {
  metadata: {
    id: "builtin-project-report",
    name: "\u9879\u76EE\u62A5\u544A",
    description: "\u6807\u51C6\u9879\u76EE\u62A5\u544A\u6A21\u677F",
    category: types.TemplateCategory.BUSINESS,
    tags: ["\u62A5\u544A", "\u9879\u76EE", "\u5546\u52A1"],
    author: "System",
    isBuiltin: true
  },
  content: `
    <h1 style="text-align: center;">{{projectName}} \u9879\u76EE\u62A5\u544A</h1>
    <p style="text-align: center; color: #666;">\u62A5\u544A\u65E5\u671F\uFF1A{{reportDate}}</p>
    
    <h2>1. \u6267\u884C\u6458\u8981</h2>
    <p>{{summary}}</p>
    
    <h2>2. \u9879\u76EE\u80CC\u666F</h2>
    <p>{{background}}</p>
    
    <h2>3. \u9879\u76EE\u76EE\u6807</h2>
    <ul>
      <li>\u4E3B\u8981\u76EE\u68071</li>
      <li>\u4E3B\u8981\u76EE\u68072</li>
      <li>\u4E3B\u8981\u76EE\u68073</li>
    </ul>
    
    <h2>4. \u9879\u76EE\u8303\u56F4</h2>
    <h3>4.1 \u5305\u542B\u5185\u5BB9</h3>
    <ul>
      <li>\u8303\u56F4\u98791</li>
      <li>\u8303\u56F4\u98792</li>
    </ul>
    
    <h3>4.2 \u6392\u9664\u5185\u5BB9</h3>
    <ul>
      <li>\u6392\u9664\u98791</li>
      <li>\u6392\u9664\u98792</li>
    </ul>
    
    <h2>5. \u5B9E\u65BD\u8BA1\u5212</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: #f5f5f5;">
          <th style="border: 1px solid #ddd; padding: 8px;">\u9636\u6BB5</th>
          <th style="border: 1px solid #ddd; padding: 8px;">\u4EFB\u52A1</th>
          <th style="border: 1px solid #ddd; padding: 8px;">\u8D1F\u8D23\u4EBA</th>
          <th style="border: 1px solid #ddd; padding: 8px;">\u622A\u6B62\u65E5\u671F</th>
          <th style="border: 1px solid #ddd; padding: 8px;">\u72B6\u6001</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">\u7B2C\u4E00\u9636\u6BB5</td>
          <td style="border: 1px solid #ddd; padding: 8px;">\u9700\u6C42\u5206\u6790</td>
          <td style="border: 1px solid #ddd; padding: 8px;">{{person1}}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">{{date1}}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">\u8FDB\u884C\u4E2D</td>
        </tr>
      </tbody>
    </table>
    
    <h2>6. \u98CE\u9669\u8BC4\u4F30</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: #f5f5f5;">
          <th style="border: 1px solid #ddd; padding: 8px;">\u98CE\u9669</th>
          <th style="border: 1px solid #ddd; padding: 8px;">\u53EF\u80FD\u6027</th>
          <th style="border: 1px solid #ddd; padding: 8px;">\u5F71\u54CD</th>
          <th style="border: 1px solid #ddd; padding: 8px;">\u5E94\u5BF9\u63AA\u65BD</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">\u98CE\u96691</td>
          <td style="border: 1px solid #ddd; padding: 8px;">\u4E2D</td>
          <td style="border: 1px solid #ddd; padding: 8px;">\u9AD8</td>
          <td style="border: 1px solid #ddd; padding: 8px;">\u63AA\u65BD1</td>
        </tr>
      </tbody>
    </table>
    
    <h2>7. \u9884\u7B97</h2>
    <p>\u603B\u9884\u7B97\uFF1A{{budget}}</p>
    
    <h2>8. \u7ED3\u8BBA\u4E0E\u5EFA\u8BAE</h2>
    <p>{{conclusion}}</p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
      <p><strong>\u62A5\u544A\u4EBA\uFF1A</strong>{{author}}</p>
      <p><strong>\u90E8\u95E8\uFF1A</strong>{{department}}</p>
    </div>
  `,
  variables: [{
    key: "projectName",
    label: "\u9879\u76EE\u540D\u79F0",
    type: "text",
    required: true
  }, {
    key: "reportDate",
    label: "\u62A5\u544A\u65E5\u671F",
    type: "date",
    required: true
  }, {
    key: "summary",
    label: "\u6267\u884C\u6458\u8981",
    type: "text"
  }, {
    key: "background",
    label: "\u9879\u76EE\u80CC\u666F",
    type: "text"
  }, {
    key: "budget",
    label: "\u9879\u76EE\u9884\u7B97",
    type: "text"
  }, {
    key: "author",
    label: "\u62A5\u544A\u4EBA",
    type: "text"
  }, {
    key: "department",
    label: "\u90E8\u95E8",
    type: "text"
  }]
};
const blogPostTemplate = {
  metadata: {
    id: "builtin-blog-post",
    name: "\u535A\u5BA2\u6587\u7AE0",
    description: "\u6807\u51C6\u535A\u5BA2\u6587\u7AE0\u6A21\u677F\uFF0C\u5305\u542B\u6807\u9898\u3001\u5143\u4FE1\u606F\u548C\u5185\u5BB9\u7ED3\u6784",
    category: types.TemplateCategory.CREATIVE,
    tags: ["\u535A\u5BA2", "\u6587\u7AE0", "\u521B\u4F5C"],
    author: "System",
    isBuiltin: true
  },
  content: `
    <h1>{{title}}</h1>
    <div style="color: #666; font-size: 14px; margin: 10px 0;">
      <span>\u4F5C\u8005\uFF1A{{author}}</span> | 
      <span>\u53D1\u5E03\u65E5\u671F\uFF1A{{publishDate}}</span> | 
      <span>\u5206\u7C7B\uFF1A{{category}}</span>
    </div>
    
    <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
      <strong>\u6458\u8981\uFF1A</strong>{{abstract}}
    </div>
    
    <h2>\u5F15\u8A00</h2>
    <p>{{introduction}}</p>
    
    <h2>\u4E3B\u8981\u5185\u5BB9</h2>
    <h3>\u7B2C\u4E00\u90E8\u5206</h3>
    <p>\u5185\u5BB9\u8BE6\u8FF0...</p>
    
    <h3>\u7B2C\u4E8C\u90E8\u5206</h3>
    <p>\u5185\u5BB9\u8BE6\u8FF0...</p>
    
    <h3>\u7B2C\u4E09\u90E8\u5206</h3>
    <p>\u5185\u5BB9\u8BE6\u8FF0...</p>
    
    <h2>\u7ED3\u8BBA</h2>
    <p>{{conclusion}}</p>
    
    <h2>\u53C2\u8003\u8D44\u6599</h2>
    <ol>
      <li>\u53C2\u8003\u6587\u732E1</li>
      <li>\u53C2\u8003\u6587\u732E2</li>
    </ol>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      <p><strong>\u6807\u7B7E\uFF1A</strong>{{tags}}</p>
      <p><strong>\u7248\u6743\u58F0\u660E\uFF1A</strong>\u672C\u6587\u4E3A\u539F\u521B\u6587\u7AE0\uFF0C\u8F6C\u8F7D\u8BF7\u6CE8\u660E\u51FA\u5904\u3002</p>
    </div>
  `,
  variables: [{
    key: "title",
    label: "\u6587\u7AE0\u6807\u9898",
    type: "text",
    required: true
  }, {
    key: "author",
    label: "\u4F5C\u8005",
    type: "text",
    required: true
  }, {
    key: "publishDate",
    label: "\u53D1\u5E03\u65E5\u671F",
    type: "date"
  }, {
    key: "category",
    label: "\u5206\u7C7B",
    type: "text"
  }, {
    key: "tags",
    label: "\u6807\u7B7E",
    type: "text"
  }, {
    key: "abstract",
    label: "\u6458\u8981",
    type: "text"
  }, {
    key: "introduction",
    label: "\u5F15\u8A00",
    type: "text"
  }, {
    key: "conclusion",
    label: "\u7ED3\u8BBA",
    type: "text"
  }]
};
const blankTemplate = {
  metadata: {
    id: "builtin-blank",
    name: "\u7A7A\u767D\u6587\u6863",
    description: "\u4ECE\u7A7A\u767D\u6587\u6863\u5F00\u59CB\u521B\u4F5C",
    category: types.TemplateCategory.PERSONAL,
    tags: ["\u7A7A\u767D", "\u57FA\u7840"],
    author: "System",
    isBuiltin: true
  },
  content: "<p><br></p>",
  variables: []
};
const builtinTemplates = [meetingMinutesTemplate, resumeTemplate, projectReportTemplate, blogPostTemplate, blankTemplate];
({
  [types.TemplateCategory.BUSINESS]: [meetingMinutesTemplate, projectReportTemplate],
  [types.TemplateCategory.PERSONAL]: [resumeTemplate, blankTemplate],
  [types.TemplateCategory.CREATIVE]: [blogPostTemplate],
  [types.TemplateCategory.EDUCATION]: [],
  [types.TemplateCategory.TECHNICAL]: [],
  [types.TemplateCategory.CUSTOM]: []
});

exports.builtinTemplates = builtinTemplates;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
