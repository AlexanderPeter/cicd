import { Link } from 'react-router-dom';
import Banner from '../components/Banner/Banner';
import { CiSearch, TbError404 } from '../icons';

export default function NotFoundPage() {
  return (
    <>
      <Banner title="Terminumfragen" />
      <div className="dashboard">
        <Link to="/">
          <div className="panel shadow">
            <header className="titlebar">
              <h2>Zurück zur Hauptseite</h2>
            </header>
            <div className="entry">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <CiSearch
                  size={400}
                  style={{
                    marginTop: 0,
                    marginBottom: 0,
                    marginLeft: 100,
                    marginRight: 100,
                  }}
                />
                <TbError404 size={200} style={{ position: 'absolute', bottom: 120, right: 220 }} />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
