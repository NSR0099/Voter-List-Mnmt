import { useLanguage } from "../i18n/LanguageContext";
import { STRINGS } from "../i18n/strings";

export default function Footer() {
    const { lang } = useLanguage();
    const t = STRINGS[lang];

    return (
        <footer className="footer" id="contact">
            <div className="footer-grid">
                <div>
                    <h3>{t.eciTitle}</h3>
                    <p>
                        {t.address}<br />
                        {t.city}
                    </p>
                </div>

                <div>
                    <h4>{t.importantLinks}</h4>
                    <ul>
                        <li><a href="https://www.eci.gov.in/" target="_blank">{t.eciWebsite}</a></li>
                        <li><a>{t.privacyPolicy}</a></li>
                        <li><a>{t.accessibility}</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                {t.copyright}
            </div>
        </footer>
    );
}
