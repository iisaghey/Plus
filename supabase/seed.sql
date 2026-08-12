-- Demo seed data for AqoonsiPlus. Uses fixed literal UUIDs so child records can
-- reference their parents without lookups. Safe to re-run: seeded rows are
-- deleted by id before insert.

-- ---------- Categories ----------
insert into public.categories (id, name, slug, description, icon, status) values
  ('a1000000-0000-4000-8000-000000000001','Government Official','government-official','Serving or former public office holders within national or local government.','landmark','active'),
  ('a1000000-0000-4000-8000-000000000002','Political Leader','political-leader','Elected officials, party leaders, and political figures.','flag','active'),
  ('a1000000-0000-4000-8000-000000000003','Business Leader','business-leader','Executives and entrepreneurs leading organizations and industries.','briefcase','active'),
  ('a1000000-0000-4000-8000-000000000004','Professional','professional','Accomplished professionals across law, medicine, engineering and more.','user-check','active'),
  ('a1000000-0000-4000-8000-000000000005','Academic & Research','academic-research','University leadership, researchers, and academics.','graduation-cap','active'),
  ('a1000000-0000-4000-8000-000000000006','Civil Society & NGO','civil-society-ngo','Leaders of non-profits, NGOs, and civil society organizations.','heart-handshake','active')
on conflict (id) do nothing;

-- ---------- Organizations ----------
insert into public.organizations (id, name, type, country, description, status) values
  ('b2000000-0000-4000-8000-000000000001','Federal Ministry of Foreign Affairs','government','Somalia','National ministry responsible for foreign policy and diplomacy.','active'),
  ('b2000000-0000-4000-8000-000000000002','Federal Parliament','government','Somalia','The bicameral national legislature.','active'),
  ('b2000000-0000-4000-8000-000000000003','Central Reserve Bank','government','Somalia','National monetary authority and central bank.','active'),
  ('b2000000-0000-4000-8000-000000000004','Horn Tech Innovations','private','Somalia','Regional technology and fintech company.','active'),
  ('b2000000-0000-4000-8000-000000000005','Global Health Alliance','ngo','Kenya','International public-health non-profit operating across East Africa.','active'),
  ('b2000000-0000-4000-8000-000000000006','Banadir University','academic','Somalia','Higher-education institution and medical school.','active')
on conflict (id) do nothing;

-- ---------- Profiles ----------
insert into public.profiles (
  id, slug, full_name, preferred_title, profession, current_position,
  organization_id, category_id, country, location, nationality,
  photo_url, cover_url, short_bio, email, website, social_links,
  verification_status, verified_at, is_public, view_count, status
) values
  (
    'c3000000-0000-4000-8000-000000000001','amina-yusuf-warsame','Amina Yusuf Warsame','Dr.','Diplomat & Public Servant','Minister of Foreign Affairs',
    'b2000000-0000-4000-8000-000000000001','a1000000-0000-4000-8000-000000000001','Somalia','Mogadishu, Somalia','Somali',
    'https://i.pravatar.cc/512?img=47','https://picsum.photos/seed/amina-cover/1600/500',
    'Dr. Amina Yusuf Warsame is a career diplomat and the current Minister of Foreign Affairs, recognized for her leadership in regional diplomacy and international development partnerships.',
    'amina.warsame@example.gov.so','https://mofa.example.gov.so','{"linkedin":"https://linkedin.com/in/amina-warsame","twitter":"https://twitter.com/aminawarsame"}',
    'verified', now() - interval '40 days', true, 18420, 'active'
  ),
  (
    'c3000000-0000-4000-8000-000000000002','mohamed-abdi-hassan','Mohamed Abdi Hassan','Eng.','Technology Entrepreneur','Founder & CEO',
    'b2000000-0000-4000-8000-000000000004','a1000000-0000-4000-8000-000000000003','Somalia','Hargeisa, Somalia','Somali',
    'https://i.pravatar.cc/512?img=13','https://picsum.photos/seed/mohamed-cover/1600/500',
    'Mohamed Abdi Hassan founded Horn Tech Innovations, one of the region''s fastest-growing fintech companies, after a decade in software engineering across East Africa.',
    'mohamed@horntech.example.com','https://horntech.example.com','{"linkedin":"https://linkedin.com/in/mohamed-abdi-hassan"}',
    'verified', now() - interval '12 days', true, 9310, 'active'
  ),
  (
    'c3000000-0000-4000-8000-000000000003','farah-ali-nur','Farah Ali Nur','Hon.','Legislator','Member of Parliament',
    'b2000000-0000-4000-8000-000000000002','a1000000-0000-4000-8000-000000000002','Somalia','Mogadishu, Somalia','Somali',
    'https://i.pravatar.cc/512?img=52','https://picsum.photos/seed/farah-cover/1600/500',
    'Hon. Farah Ali Nur represents the Banadir constituency and chairs the Parliamentary Committee on Public Finance.',
    'farah.nur@example.gov.so',null,'{}',
    'verified', now() - interval '90 days', true, 6710, 'active'
  ),
  (
    'c3000000-0000-4000-8000-000000000004','sahra-ibrahim-elmi','Sahra Ibrahim Elmi','Prof.','Academic & Physician','Dean, Faculty of Medicine',
    'b2000000-0000-4000-8000-000000000006','a1000000-0000-4000-8000-000000000005','Somalia','Mogadishu, Somalia','Somali',
    'https://i.pravatar.cc/512?img=45','https://picsum.photos/seed/sahra-cover/1600/500',
    'Prof. Sahra Ibrahim Elmi leads the Faculty of Medicine at Banadir University and researches maternal health outcomes across the Horn of Africa.',
    'sahra.elmi@example.edu',null,'{}',
    'pending', null, true, 2140, 'active'
  ),
  (
    'c3000000-0000-4000-8000-000000000005','ahmed-jama-roble','Ahmed Jama Roble',null,'Public Health Advocate','Executive Director',
    'b2000000-0000-4000-8000-000000000005','a1000000-0000-4000-8000-000000000006','Kenya','Nairobi, Kenya','Somali-Kenyan',
    'https://i.pravatar.cc/512?img=33','https://picsum.photos/seed/ahmed-cover/1600/500',
    'Ahmed Jama Roble has spent 15 years building community health programs across East Africa as Executive Director of the Global Health Alliance.',
    'ahmed@globalhealthalliance.example.org','https://globalhealthalliance.example.org','{}',
    'verified', now() - interval '5 days', true, 4030, 'active'
  ),
  (
    'c3000000-0000-4000-8000-000000000006','zainab-omar-sheikh','Zainab Omar Sheikh','Amb.','Senior Diplomat','Ambassador-at-Large',
    'b2000000-0000-4000-8000-000000000001','a1000000-0000-4000-8000-000000000001','Somalia','Geneva, Switzerland','Somali',
    'https://i.pravatar.cc/512?img=44','https://picsum.photos/seed/zainab-cover/1600/500',
    'Ambassador Zainab Omar Sheikh represents Somalia in multilateral institutions and has served in three overseas missions.',
    'zainab.sheikh@example.gov.so',null,'{"linkedin":"https://linkedin.com/in/zainab-sheikh"}',
    'verified', now() - interval '200 days', true, 7890, 'active'
  ),
  (
    'c3000000-0000-4000-8000-000000000007','yusuf-abdirahman-kahin','Yusuf Abdirahman Kahin','Mr.','Economist','Deputy Governor',
    'b2000000-0000-4000-8000-000000000003','a1000000-0000-4000-8000-000000000001','Somalia','Mogadishu, Somalia','Somali',
    'https://i.pravatar.cc/512?img=14','https://picsum.photos/seed/yusuf-cover/1600/500',
    'Yusuf Abdirahman Kahin oversees monetary policy implementation as Deputy Governor of the Central Reserve Bank.',
    'yusuf.kahin@example.gov.so',null,'{}',
    'pending', null, true, 1275, 'active'
  )
on conflict (id) do nothing;

-- ---------- Biographies ----------
insert into public.biographies (profile_id, summary, content, status) values
  ('c3000000-0000-4000-8000-000000000001',
   'Career diplomat turned Minister of Foreign Affairs, known for rebuilding regional partnerships.',
   E'Amina Yusuf Warsame began her career in the foreign service in 2004 after completing a doctorate in International Relations. Over two decades she has represented her country in bilateral and multilateral negotiations, playing a central role in regional trade agreements and post-conflict diplomacy.\n\nAs Minister of Foreign Affairs, she has prioritized economic diplomacy, diaspora engagement, and strengthening ties with regional blocs. She is widely regarded as one of the most effective diplomats of her generation, credited with reopening three long-stalled bilateral dialogues.\n\nOutside government, Dr. Warsame mentors young women pursuing careers in international affairs and sits on the advisory board of two regional policy institutes.',
   'active'),
  ('c3000000-0000-4000-8000-000000000002',
   'Engineer-turned-entrepreneur who built one of the region''s leading fintech companies from the ground up.',
   E'Mohamed Abdi Hassan studied computer engineering before spending seven years as a software engineer at regional telecom firms. In 2016 he founded Horn Tech Innovations to address gaps in digital payments infrastructure.\n\nUnder his leadership the company has grown to serve millions of users across three countries, and he has become a leading voice on technology policy and financial inclusion in the region.',
   'active'),
  ('c3000000-0000-4000-8000-000000000003','Legislator focused on public finance oversight and constituency development.','Farah Ali Nur has represented the Banadir constituency for two terms, focusing on transparent public spending and infrastructure investment.','active'),
  ('c3000000-0000-4000-8000-000000000004','Physician and academic leader advancing maternal health research.','Prof. Sahra Ibrahim Elmi combines a clinical background in obstetrics with academic leadership, publishing widely on maternal health outcomes.','active'),
  ('c3000000-0000-4000-8000-000000000005','Public health advocate leading community health programs across East Africa.','Ahmed Jama Roble has built the Global Health Alliance into a leading regional public-health organization over 15 years.','active'),
  ('c3000000-0000-4000-8000-000000000006','Senior diplomat representing Somalia across multilateral institutions.','Ambassador Zainab Omar Sheikh has served in three overseas missions and now leads multilateral engagement from Geneva.','active'),
  ('c3000000-0000-4000-8000-000000000007','Economist overseeing monetary policy at the Central Reserve Bank.','Yusuf Abdirahman Kahin brings a decade of macroeconomic policy experience to his role as Deputy Governor.','active')
on conflict (profile_id) do nothing;

-- ---------- Career timeline ----------
insert into public.career_timeline (profile_id, title, organization, location, start_date, end_date, is_current, description, sort_order) values
  ('c3000000-0000-4000-8000-000000000001','Minister of Foreign Affairs','Federal Ministry of Foreign Affairs','Mogadishu, Somalia','2024-01-15',null,true,'Leading national foreign policy, diplomacy, and international partnerships.',1),
  ('c3000000-0000-4000-8000-000000000001','Deputy Minister of Foreign Affairs','Federal Ministry of Foreign Affairs','Mogadishu, Somalia','2019-03-01','2023-12-31',false,'Oversaw regional diplomatic relations and trade negotiations.',2),
  ('c3000000-0000-4000-8000-000000000001','Ambassador to the African Union','Federal Ministry of Foreign Affairs','Addis Ababa, Ethiopia','2013-06-01','2019-02-28',false,'Represented national interests at the African Union headquarters.',3),
  ('c3000000-0000-4000-8000-000000000001','Foreign Service Officer','Federal Ministry of Foreign Affairs','Mogadishu, Somalia','2004-09-01','2013-05-31',false,'Entry-level and mid-career diplomatic postings.',4),

  ('c3000000-0000-4000-8000-000000000002','Founder & CEO','Horn Tech Innovations','Hargeisa, Somalia','2016-04-01',null,true,'Leading strategy, product, and expansion across three countries.',1),
  ('c3000000-0000-4000-8000-000000000002','Senior Software Engineer','Regional Telecom Group','Nairobi, Kenya','2011-01-01','2016-03-31',false,'Led backend engineering for mobile money platforms.',2),
  ('c3000000-0000-4000-8000-000000000002','Software Engineer','Regional Telecom Group','Nairobi, Kenya','2009-06-01','2010-12-31',false,'Built early payments infrastructure.',3),

  ('c3000000-0000-4000-8000-000000000003','Member of Parliament','Federal Parliament','Mogadishu, Somalia','2016-02-01',null,true,'Representing the Banadir constituency; chairs the Public Finance Committee.',1),
  ('c3000000-0000-4000-8000-000000000003','District Council Member','Banadir Regional Administration','Mogadishu, Somalia','2011-01-01','2016-01-31',false,'Local governance and constituency services.',2),

  ('c3000000-0000-4000-8000-000000000004','Dean, Faculty of Medicine','Banadir University','Mogadishu, Somalia','2021-09-01',null,true,'Leading medical education and research programs.',1),
  ('c3000000-0000-4000-8000-000000000004','Associate Professor of Obstetrics','Banadir University','Mogadishu, Somalia','2014-09-01','2021-08-31',false,'Clinical teaching and maternal health research.',2),

  ('c3000000-0000-4000-8000-000000000005','Executive Director','Global Health Alliance','Nairobi, Kenya','2019-01-01',null,true,'Leading regional public-health programs across five countries.',1),
  ('c3000000-0000-4000-8000-000000000005','Regional Program Manager','Global Health Alliance','Nairobi, Kenya','2010-01-01','2018-12-31',false,'Managed community health initiatives.',2),

  ('c3000000-0000-4000-8000-000000000006','Ambassador-at-Large','Federal Ministry of Foreign Affairs','Geneva, Switzerland','2022-01-01',null,true,'Multilateral engagement across UN institutions.',1),
  ('c3000000-0000-4000-8000-000000000006','Ambassador to the United Kingdom','Federal Ministry of Foreign Affairs','London, United Kingdom','2016-01-01','2021-12-31',false,'Bilateral relations and diaspora affairs.',2),

  ('c3000000-0000-4000-8000-000000000007','Deputy Governor','Central Reserve Bank','Mogadishu, Somalia','2023-05-01',null,true,'Overseeing monetary policy implementation.',1),
  ('c3000000-0000-4000-8000-000000000007','Director of Economic Research','Central Reserve Bank','Mogadishu, Somalia','2017-01-01','2023-04-30',false,'Led macroeconomic research and policy analysis.',2)
on conflict do nothing;

-- ---------- Government positions ----------
insert into public.government_positions (profile_id, position_title, institution, government_level, country, start_date, end_date, is_current, description, sort_order) values
  ('c3000000-0000-4000-8000-000000000001','Minister of Foreign Affairs','Federal Ministry of Foreign Affairs','federal','Somalia','2024-01-15',null,true,'Cabinet-level minister responsible for foreign policy.',1),
  ('c3000000-0000-4000-8000-000000000003','Member of Parliament','Federal Parliament','federal','Somalia','2016-02-01',null,true,'Elected legislator for the Banadir constituency.',1),
  ('c3000000-0000-4000-8000-000000000006','Ambassador-at-Large','Federal Ministry of Foreign Affairs','federal','Somalia','2022-01-01',null,true,'Senior multilateral diplomatic appointment.',1),
  ('c3000000-0000-4000-8000-000000000007','Deputy Governor','Central Reserve Bank','federal','Somalia','2023-05-01',null,true,'Senior monetary authority appointment.',1)
on conflict do nothing;

-- ---------- Achievements ----------
insert into public.achievements (profile_id, title, category, issuing_organization, achievement_date, description, sort_order) values
  ('c3000000-0000-4000-8000-000000000001','Regional Diplomacy Award','Recognition','Horn of Africa Policy Institute','2023-11-10','Awarded for reopening long-stalled bilateral trade dialogues.',1),
  ('c3000000-0000-4000-8000-000000000001','40 Under 40 in African Diplomacy','Recognition','Continental Affairs Magazine','2018-06-01','Named among the continent''s most influential young diplomats.',2),
  ('c3000000-0000-4000-8000-000000000002','Fintech Innovator of the Year','Industry Award','East Africa Tech Awards','2022-09-14','Recognized for expanding digital payment access to underserved communities.',1),
  ('c3000000-0000-4000-8000-000000000002','Forbes 30 Under 30 Africa','Recognition','Forbes Africa','2019-03-01','Listed for contributions to financial technology.',2),
  ('c3000000-0000-4000-8000-000000000003','Legislator of the Year','Recognition','Public Finance Transparency Forum','2022-12-01','Recognized for public finance oversight work.',1),
  ('c3000000-0000-4000-8000-000000000004','Excellence in Maternal Health Research','Academic Award','Regional Medical Association','2021-05-20','Honored for a decade of maternal health research.',1),
  ('c3000000-0000-4000-8000-000000000005','Community Health Champion','Recognition','East Africa Public Health Network','2020-10-05','Recognized for expanding community health programs.',1),
  ('c3000000-0000-4000-8000-000000000006','Distinguished Diplomatic Service Medal','Government Honor','Federal Ministry of Foreign Affairs','2021-08-15','Awarded for two decades of diplomatic service.',1)
on conflict do nothing;

-- ---------- Official activities ----------
insert into public.official_activities (profile_id, title, activity_type, activity_date, location, organization, description, sort_order) values
  ('c3000000-0000-4000-8000-000000000001','Bilateral Trade Summit','Summit','2026-03-12','Nairobi, Kenya','Federal Ministry of Foreign Affairs','Led delegation negotiating a new regional trade framework.',1),
  ('c3000000-0000-4000-8000-000000000001','Diaspora Engagement Forum','Forum','2025-11-02','Mogadishu, Somalia','Federal Ministry of Foreign Affairs','Hosted forum connecting diaspora investors with local ministries.',2),
  ('c3000000-0000-4000-8000-000000000002','Digital Payments Policy Roundtable','Roundtable','2026-01-22','Hargeisa, Somalia','Horn Tech Innovations','Presented recommendations on financial-inclusion policy.',1),
  ('c3000000-0000-4000-8000-000000000005','Regional Health Ministers Conference','Conference','2025-09-18','Kampala, Uganda','Global Health Alliance','Presented community health outcomes across five countries.',1)
on conflict do nothing;

-- ---------- Official travel ----------
insert into public.official_travel (profile_id, destination_country, destination_city, purpose, delegation, start_date, end_date, description, sort_order) values
  ('c3000000-0000-4000-8000-000000000001','Kenya','Nairobi','Bilateral Trade Summit','Ministerial Delegation','2026-03-10','2026-03-13','Led official delegation for trade framework negotiations.',1),
  ('c3000000-0000-4000-8000-000000000001','Ethiopia','Addis Ababa','African Union Assembly','National Delegation','2025-08-05','2025-08-09','Represented the country at the AU annual assembly.',2),
  ('c3000000-0000-4000-8000-000000000006','Switzerland','Geneva','UN Human Rights Council Session','Permanent Mission','2026-02-20','2026-02-27','Delivered national statement at the Council session.',1)
on conflict do nothing;

-- ---------- Speeches ----------
insert into public.speeches (profile_id, title, event, speech_date, location, summary, sort_order) values
  ('c3000000-0000-4000-8000-000000000001','Building Bridges Through Regional Diplomacy','Bilateral Trade Summit','2026-03-12','Nairobi, Kenya','Outlined a vision for deeper regional economic integration.',1),
  ('c3000000-0000-4000-8000-000000000001','Diaspora as Nation Builders','Diaspora Engagement Forum','2025-11-02','Mogadishu, Somalia','Called on diaspora communities to invest in local institutions.',2),
  ('c3000000-0000-4000-8000-000000000002','The Future of Digital Finance in the Horn of Africa','Digital Payments Policy Roundtable','2026-01-22','Hargeisa, Somalia','Argued for regulatory frameworks that encourage fintech innovation.',1)
on conflict do nothing;

-- ---------- Media ----------
insert into public.media (profile_id, media_type, title, caption, category, external_url, event_date, is_featured, sort_order) values
  ('c3000000-0000-4000-8000-000000000001','image','Ministerial Delegation in Nairobi','Dr. Warsame leading the delegation at the Bilateral Trade Summit.','Official Event','https://picsum.photos/seed/amina-media-1/900/600','2026-03-12',true,1),
  ('c3000000-0000-4000-8000-000000000001','image','Diaspora Engagement Forum','Addressing diaspora investors in Mogadishu.','Official Event','https://picsum.photos/seed/amina-media-2/900/600','2025-11-02',false,2),
  ('c3000000-0000-4000-8000-000000000001','image','Press Interview','Interview following the AU Assembly session.','Press','https://picsum.photos/seed/amina-media-3/900/600','2025-08-07',false,3),
  ('c3000000-0000-4000-8000-000000000002','image','Horn Tech Product Launch','Launch event for the company''s new payments platform.','Official Event','https://picsum.photos/seed/mohamed-media-1/900/600','2025-06-01',true,1),
  ('c3000000-0000-4000-8000-000000000002','image','Fintech Awards Ceremony','Receiving the Fintech Innovator of the Year award.','Award','https://picsum.photos/seed/mohamed-media-2/900/600','2022-09-14',false,2)
on conflict do nothing;

-- ---------- Documents ----------
insert into public.documents (profile_id, title, category, issuing_organization, document_date, is_private, verification_status, sort_order) values
  ('c3000000-0000-4000-8000-000000000001','Ministerial Appointment Letter','appointment_letter','Office of the President','2024-01-15',false,'verified',1),
  ('c3000000-0000-4000-8000-000000000001','Regional Diplomacy Award Certificate','certificate','Horn of Africa Policy Institute','2023-11-10',false,'verified',2),
  ('c3000000-0000-4000-8000-000000000002','Fintech Innovator of the Year Certificate','award','East Africa Tech Awards','2022-09-14',false,'verified',1)
on conflict do nothing;

-- ---------- QR profiles ----------
insert into public.qr_profiles (profile_id, scan_count, status)
select id, floor(random() * 500)::int, 'active' from public.profiles
where id in (
  'c3000000-0000-4000-8000-000000000001','c3000000-0000-4000-8000-000000000002',
  'c3000000-0000-4000-8000-000000000003','c3000000-0000-4000-8000-000000000004',
  'c3000000-0000-4000-8000-000000000005','c3000000-0000-4000-8000-000000000006',
  'c3000000-0000-4000-8000-000000000007'
)
on conflict (profile_id) do nothing;

-- ---------- Verifications ----------
insert into public.verifications (profile_id, identity_verified, information_reviewed, status, verified_at) values
  ('c3000000-0000-4000-8000-000000000001', true, true, 'verified', now() - interval '40 days'),
  ('c3000000-0000-4000-8000-000000000002', true, true, 'verified', now() - interval '12 days'),
  ('c3000000-0000-4000-8000-000000000003', true, true, 'verified', now() - interval '90 days'),
  ('c3000000-0000-4000-8000-000000000005', true, true, 'verified', now() - interval '5 days'),
  ('c3000000-0000-4000-8000-000000000006', true, true, 'verified', now() - interval '200 days'),
  ('c3000000-0000-4000-8000-000000000004', false, true, 'pending', null),
  ('c3000000-0000-4000-8000-000000000007', false, false, 'pending', null)
on conflict do nothing;
