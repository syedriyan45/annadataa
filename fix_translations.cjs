const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'translations.js');
let content = fs.readFileSync(filePath, 'utf8');

const startIdx = content.indexOf('  bn: {');
if (startIdx === -1) {
  console.error("Could not find '  bn: {'");
  process.exit(1);
}

const endIdx = content.indexOf('    card: { explore:', startIdx);
if (endIdx === -1) {
  console.error("Could not find '    card: { explore:' under bn");
  process.exit(1);
}

const authStr = '    auth: { promptName: "আপনার নাম লিখুন:", defaultName: "কৃষক" },';
const authIdx = content.indexOf(authStr, startIdx);
if (authIdx === -1) {
  console.error("Could not find auth line in bn");
  process.exit(1);
}

const targetStart = authIdx + authStr.length;

const replacement = `\n    nav: { dashboard: "ড্যাশবোর্ড", market: "বাজার", weather: "আবহাওয়া", signIn: "সাইন ইন", signOut: "সাইন আউট" },
    dashboard: { welcome: "স্বাগতম", guest: "স্বাগতম, কৃষক", subtitle: "আজকের জন্য আপনার কৃষি তথ্য এখানে রয়েছে।", location: "📍 অটো (GPS)" },
    sections: {
      cropAdvisory: { title: "ফসল পরামর্শ", desc: "এআই-চালিত ফসল রোগ নির্ণয় এবং ব্যক্তিগত কৃষি নির্দেশিকা।" },
      weather: { title: "আবহাওয়া তথ্য", desc: "স্থানীয় ৭ দিনের পূর্বাভাস এবং সেচ পরিকল্পনা।" },
      market: { title: "বাজার মূল্য", desc: "রিয়েল-টাইม এপিএমসি বাজারের হার।" },
      farmResource: { title: "খামার সম্পদ", desc: "ডিজিটাল খামার লগবুক।" },
      marketplace: { title: "সরাসরি বাজার", desc: "কমিশন-মুক্ত বাণিজ্য।" },
      govSchemes: { title: "সরকারী প্রকল্প", desc: "স্মার্ট যোগ্যতা পরীক্ষক।" }
    },\n`;

const newContent = content.substring(0, targetStart) + replacement + content.substring(endIdx);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log("Successfully replaced corrupted Bengali translation block!");
