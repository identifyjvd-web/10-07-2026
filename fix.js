const fs = require('fs');
let c = fs.readFileSync('School_Panel.html', 'utf8');

const codeToInsert = `            function binLpClick(id, e) {
                if (e) { e.stopPropagation(); e.preventDefault(); }
                if (binLpDidTrigger) {
                    binLpDidTrigger = false;
                    return;
                }
                permDeleteRecordFromBin(id);
            }

            function toggleBinSelection(id) {
                const selectionSet = syncSelectedRecordsSection();
                const sid = String(id);
                if (selectionSet.has(sid)) selectionSet.delete(sid);
                else selectionSet.add(sid);
                selectedRecords = selectionSet;
                
                if (document.getElementById('bin-content')) {
                    renderRecycleBin();
                } else {
                    renderCurrentRecordsPage();
                }
                
                updateBulkHeader();
            }

            function toggleAllBinSelection() {
                const selectionSet = syncSelectedRecordsSection();
                if (selectionSet.size === bin.length) {
                    selectionSet.clear();
                } else {
                    bin.forEach(x => selectionSet.add(String(x.id)));
                }
                selectedRecords = selectionSet;
                
                if (document.getElementById('bin-content')) {
                    renderRecycleBin();
                } else {
                    renderCurrentRecordsPage();
                }
                
                updateBulkHeader();
            }

            function bulkBinRestore() {
                if (selectedRecords.size === 0) return;
                showModal('confirm', 'Restore Selected?', 'Are you sure you want to restore ' + selectedRecords.size + ' records?', () => {
                    const ids = Array.from(selectedRecords);
                    let count = 0;
                    ids.forEach(id => {
                        const idx = db.findIndex(r => String(r.id) === String(id));
                        if (idx !== -1) {
                            db[idx].isDeleted = false;
                            db[idx].deletedAt = null;
                            db[idx].deletedBy = null;
                            try { if (window.idbPut) idbPut(IDB_STORE_RECORDS, db[idx]).catch(()=>{}); } catch(e){}
                            serverCallSilent('updateRecord', [db[idx]]);
                            count++;
                        }
                    });
                    showToast(count + ' records restored');
                    selectedRecords.clear();
                    bin = db.filter(r => r.isDeleted === true || String(r.isDeleted).toLowerCase() === 'true');
                    filterRecords();
                    updateBulkHeader();
                });
            }

`;

c = c.replace('            function bulkBinDelete() {', codeToInsert + '            function bulkBinDelete() {');
fs.writeFileSync('School_Panel.html', c);
console.log('Fixed!');
