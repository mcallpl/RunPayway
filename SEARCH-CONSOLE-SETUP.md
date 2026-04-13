# Google Search Console Setup Guide for RunPayway

This guide walks you through submitting your sitemap and requesting indexing in Google Search Console. No prior experience with Search Console is needed.

---

## Section 1: Verify Site Ownership

1. Open your browser and go to **https://search.google.com/search-console**
2. Sign in with the Google account you want to manage the site from.
3. Click **"Add Property"** (top-left dropdown).
4. Select the **"URL prefix"** method.
5. Enter: **https://peoplestar.com/RunPayway**
6. Click **"Continue"**.
7. Choose one of these verification methods:

**Option A -- HTML Meta Tag (recommended)**
- Copy the meta tag Google gives you.
- Add it to the `<head>` section of your root layout file.
- Push the change live.
- Return to Search Console and click **"Verify"**.

**Option B -- DNS Record**
- Copy the TXT record Google gives you.
- Log in to your domain registrar (where peoplestar.com is managed).
- Add the TXT record to your DNS settings.
- Wait up to 24 hours for DNS propagation.
- Return to Search Console and click **"Verify"**.

Once verified, you will see the Search Console dashboard for your site.

---

## Section 2: Submit Sitemap

1. In Search Console, click **"Sitemaps"** in the left sidebar.
2. In the "Add a new sitemap" field, enter: **https://peoplestar.com/RunPayway/sitemap.xml**
3. Click **"Submit"**.
4. You should see a "Success" status. Google will begin processing the sitemap.
5. Processing usually takes **1-2 days**. Check back to confirm the status shows "Success" with a page count.

---

## Section 3: Request Indexing for Priority Pages

After submitting your sitemap, manually request indexing for these 15 pages in the order listed below. This tells Google to prioritize crawling them.

**Priority page list:**

| # | URL |
|---|-----|
| 1 | https://peoplestar.com/RunPayway/learn |
| 2 | https://peoplestar.com/RunPayway/learn/what-is-income-stability |
| 3 | https://peoplestar.com/RunPayway/learn/how-to-measure-income-stability |
| 4 | https://peoplestar.com/RunPayway/learn/income-stability-vs-credit-score |
| 5 | https://peoplestar.com/RunPayway/learn/what-is-income-structure |
| 6 | https://peoplestar.com/RunPayway/learn/how-to-improve-income-stability |
| 7 | https://peoplestar.com/RunPayway/learn/income-stability-real-estate-agents |
| 8 | https://peoplestar.com/RunPayway/learn/income-stability-freelancers |
| 9 | https://peoplestar.com/RunPayway/learn/income-stability-consultants |
| 10 | https://peoplestar.com/RunPayway/learn/150k-freelancer-one-client |
| 11 | https://peoplestar.com/RunPayway/learn/income-stability-vs-income |
| 12 | https://peoplestar.com/RunPayway/learn/what-makes-income-stable |
| 13 | https://peoplestar.com/RunPayway/learn/income-concentration-risk |
| 14 | https://peoplestar.com/RunPayway/learn/terms |
| 15 | https://peoplestar.com/RunPayway/blog/the-income-stability-gap |

**For each page, follow these steps:**

1. Click the **search bar at the top** of Search Console (the URL Inspection tool).
2. Paste the full URL from the list above.
3. Press Enter and wait for the inspection to load.
4. Click **"Request Indexing"**.
5. Wait for the confirmation message (this can take 1-2 minutes per URL).
6. Move to the next URL in the list.

**Important:** Google limits how many indexing requests you can make per day. If you see a message saying you have hit the limit, stop and wait **24 hours** before continuing with the remaining URLs.

---

## Section 4: Monitor

After completing the steps above, check back on these reports:

- **After 1 week:** Go to **"Pages"** (formerly "Coverage") in the left sidebar. Look at how many pages are indexed. Check the "Why pages aren't indexed" section for any issues that need fixing.
- **After 2 weeks:** Go to **"Performance"** in the left sidebar. You should start to see your first impressions and clicks from Google search results.
- **Ongoing:** If you see pages listed under "Excluded" or "Error", investigate and fix the issue (broken links, noindex tags, redirect problems, etc.).

---

## Section 5: Ongoing Maintenance

- **After adding new pages:** Resubmit your sitemap (repeat Section 2). The sitemap should auto-update, but resubmitting tells Google to re-crawl it.
- **For new high-priority pages:** Use the URL Inspection tool to request indexing immediately (repeat the steps in Section 3).
- **Core Web Vitals:** Check the **"Core Web Vitals"** report in the left sidebar periodically. This flags performance issues (slow loading, layout shifts) that can hurt your search rankings.
- **Links report:** Check the **"Links"** report to see which external sites link to your pages and which internal pages are linked most.
