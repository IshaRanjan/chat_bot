-- Sample banking FAQ data (run after schema.sql)

insert into public.categories (name) values
  ('Cards'),
  ('Accounts'),
  ('Transfers')
on conflict (name) do nothing;

-- Cards → Credit Cards / Debit Cards
insert into public.subcategories (category_id, name)
select c.id, s.name
from public.categories c
cross join (values ('Credit Cards'), ('Debit Cards')) as s(name)
where c.name = 'Cards'
on conflict (category_id, name) do nothing;

insert into public.faqs (subcategory_id, question, answer)
select sc.id,
  'How do I block my credit card?',
  'You can block your card instantly in the SecureBank app: Cards → Credit Cards → Block Card. For lost or stolen cards, call our 24/7 hotline at 1-800-SECURE. Blocking is immediate and you can request a replacement card in the same flow.'
from public.subcategories sc
join public.categories c on c.id = sc.category_id
where c.name = 'Cards' and sc.name = 'Credit Cards'
on conflict (subcategory_id, question) do nothing;

insert into public.faqs (subcategory_id, question, answer)
select sc.id,
  'How do I increase my credit limit?',
  'Limit increases are reviewed based on account history. Go to Cards → Credit Cards → Request Limit Increase. Most decisions are available within 2 business days. You will receive an in-app notification when your request is processed.'
from public.subcategories sc
join public.categories c on c.id = sc.category_id
where c.name = 'Cards' and sc.name = 'Credit Cards'
on conflict (subcategory_id, question) do nothing;

insert into public.faqs (subcategory_id, question, answer)
select sc.id,
  'How do I replace a damaged debit card?',
  'Order a replacement under Cards → Debit Cards → Replace Card. Standard delivery is 5–7 business days; expedited shipping is available for eligible accounts. Your current card remains active until you activate the new one.'
from public.subcategories sc
join public.categories c on c.id = sc.category_id
where c.name = 'Cards' and sc.name = 'Debit Cards'
on conflict (subcategory_id, question) do nothing;

-- Accounts
insert into public.subcategories (category_id, name)
select c.id, s.name
from public.categories c
cross join (values ('Savings'), ('Checking')) as s(name)
where c.name = 'Accounts'
on conflict (category_id, name) do nothing;

insert into public.faqs (subcategory_id, question, answer)
select sc.id,
  'What is the minimum balance for savings?',
  'Our standard savings account has no minimum balance requirement. Premium tier accounts may require $5,000 to waive monthly fees—see your account agreement in Settings → Documents.'
from public.subcategories sc
join public.categories c on c.id = sc.category_id
where c.name = 'Accounts' and sc.name = 'Savings'
on conflict (subcategory_id, question) do nothing;

insert into public.faqs (subcategory_id, question, answer)
select sc.id,
  'How do I order checks?',
  'Order checks from Accounts → Checking → Order Checks. Your first order may be complimentary depending on your account type. Delivery typically takes 7–10 business days.'
from public.subcategories sc
join public.categories c on c.id = sc.category_id
where c.name = 'Accounts' and sc.name = 'Checking'
on conflict (subcategory_id, question) do nothing;

-- Transfers
insert into public.subcategories (category_id, name)
select c.id, s.name
from public.categories c
cross join (values ('Domestic'), ('International')) as s(name)
where c.name = 'Transfers'
on conflict (category_id, name) do nothing;

insert into public.faqs (subcategory_id, question, answer)
select sc.id,
  'How long do domestic transfers take?',
  'ACH transfers usually settle in 1–3 business days. Same-day wires submitted before 3 PM ET typically post the same business day. You can track status under Transfers → Activity.'
from public.subcategories sc
join public.categories c on c.id = sc.category_id
where c.name = 'Transfers' and sc.name = 'Domestic'
on conflict (subcategory_id, question) do nothing;

insert into public.faqs (subcategory_id, question, answer)
select sc.id,
  'What are international transfer fees?',
  'International wires include a $25 outgoing fee plus any correspondent bank charges. Exchange rates are shown before you confirm. Some premium accounts receive reduced fees—check Benefits in your profile.'
from public.subcategories sc
join public.categories c on c.id = sc.category_id
where c.name = 'Transfers' and sc.name = 'International'
on conflict (subcategory_id, question) do nothing;
